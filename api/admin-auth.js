import { createHmac, timingSafeEqual } from "node:crypto";
const COOKIE="chedar_admin_session", SESSION_SECONDS=28800, attempts=new Map();
function send(res,status,body){if(typeof res.status==="function")return res.status(status).json(body);res.statusCode=status;res.setHeader("Content-Type","application/json; charset=utf-8");res.end(JSON.stringify(body));}
function signature(value){return createHmac("sha256",process.env.ADMIN_SESSION_SECRET||"").update(value).digest("base64url");}
function safeEqual(a,b){const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y);}
function cookies(header=""){return Object.fromEntries(header.split(";").map(p=>{const i=p.indexOf("=");return i<0?["",""]:[p.slice(0,i).trim(),decodeURIComponent(p.slice(i+1).trim())];}).filter(([k])=>k));}
function token(email){const payload=Buffer.from(JSON.stringify({email,exp:Math.floor(Date.now()/1000)+SESSION_SECONDS})).toString("base64url");return payload+"."+signature(payload);}
function verify(value){if(!process.env.ADMIN_SESSION_SECRET||!value)return null;const [p,s]=value.split(".");if(!p||!s||!safeEqual(signature(p),s))return null;try{const d=JSON.parse(Buffer.from(p,"base64url").toString("utf8"));return d.email&&d.exp>Date.now()/1000?d:null;}catch{return null;}}
function cookie(res,value,age){res.setHeader("Set-Cookie",COOKIE+"="+value+"; Path=/; HttpOnly; SameSite=Lax; Max-Age="+age+((process.env.NODE_ENV==="production"||process.env.VERCEL)?"; Secure":""));}
export default async function handler(req,res){
res.setHeader("Cache-Control","no-store");res.setHeader("X-Content-Type-Options","nosniff");
const configured=Boolean(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD&&process.env.ADMIN_SESSION_SECRET),method=req.method||"GET";
if(method==="GET"){if(!configured)return send(res,503,{authenticated:false,configured:false,error:"Login admin belum dikonfigurasi."});const s=verify(cookies(req.headers?.cookie)[COOKIE]);return send(res,200,{authenticated:Boolean(s),email:s?.email||null,configured:true});}
if(method!=="POST"){res.setHeader("Allow","GET, POST");return send(res,405,{error:"Metode tidak diizinkan."});}
let body=req.body;if(typeof body==="string"){try{body=JSON.parse(body);}catch{body={};}}
if(body?.action==="logout"){cookie(res,"",0);return send(res,200,{ok:true});}
if(body?.action!=="login")return send(res,400,{error:"Permintaan tidak valid."});
if(!configured)return send(res,503,{error:"Admin belum dikonfigurasi. Tambahkan ADMIN_EMAIL, ADMIN_PASSWORD, dan ADMIN_SESSION_SECRET di Vercel."});
const ip=String(req.headers?.["x-forwarded-for"]||req.socket?.remoteAddress||"unknown").split(",")[0].trim(),now=Date.now();
const rec=attempts.get(ip)||{count:0,until:now+900000};if(rec.until<now){rec.count=0;rec.until=now+900000;}
if(rec.count>=8)return send(res,429,{error:"Terlalu banyak percobaan. Coba lagi dalam 15 menit."});
const email=String(body.email||"").trim().toLowerCase(),password=String(body.password||"");
if(!safeEqual(email,String(process.env.ADMIN_EMAIL).trim().toLowerCase())||!safeEqual(password,process.env.ADMIN_PASSWORD)){rec.count++;attempts.set(ip,rec);return send(res,401,{error:"Email atau password admin salah."});}
attempts.delete(ip);cookie(res,token(email),SESSION_SECONDS);return send(res,200,{ok:true,authenticated:true,email});
}
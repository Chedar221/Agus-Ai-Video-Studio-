function send(res,status,body){if(typeof res.status==="function")return res.status(status).json(body);res.statusCode=status;res.setHeader("Content-Type","application/json; charset=utf-8");res.end(JSON.stringify(body));}
const clip=(v,n)=>String(v??"").trim().slice(0,n);
const dimensions=(ratio)=>({"9:16":[768,1344],"16:9":[1344,768],"1:1":[1024,1024],"4:5":[832,1040],"3:4":[768,1024],"4:3":[1024,768],"3:2":[1024,682]}[ratio]||[1024,1024]);
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return send(res,405,{error:"Gunakan metode POST."});}
 let d=req.body;if(typeof d==="string"){try{d=JSON.parse(d)}catch{d=null}}
 if(!d||typeof d!=="object"||Array.isArray(d))return send(res,400,{error:"Data gambar tidak valid."});
 const token=process.env.CLOUDFLARE_API_TOKEN,account=process.env.CLOUDFLARE_ACCOUNT_ID;
 if(!token||!account)return send(res,503,{error:"Konfigurasi Cloudflare belum lengkap. Pastikan CLOUDFLARE_API_TOKEN dan CLOUDFLARE_ACCOUNT_ID tersedia di Vercel Preview."});
 const prompt=clip(d.prompt,1700)+"\n\nBACKGROUND IMAGE ONLY: Create a premium photographic/art-directed background visual for a poster. ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO NUMBERS, NO TYPOGRAPHY, NO LOGOS, NO WATERMARKS, NO LABELS, NO SIGNS, NO UI, NO MOCKUP, NO POSTER FRAME. Do not render any brand name or price. Leave clean negative space for later text overlay. The final typography and original logo will be added separately by the application. Focus only on beautiful relevant imagery, polished lighting, rich depth, intentional composition, and premium materials.";
 if(!prompt)return send(res,400,{error:"Prompt visual masih kosong. Buat konsep desain terlebih dahulu."});
 const refs=Array.isArray(d.images)?d.images.slice(0,4):[];
 for(const im of refs){if(!im||typeof im.data!=="string"||!/^([A-Za-z0-9+/]+={0,2})$/.test(im.data)||im.data.length>1500000)return send(res,400,{error:"Foto referensi tidak valid atau terlalu besar. Pilih ulang gambar."});}
 const ip=String(req.headers?.["x-forwarded-for"]||req.headers?.["x-real-ip"]||"anonymous").split(",")[0].trim();
 const now=Date.now(),windowMs=10*60*1000;globalThis.__chedarImageUsage||=new Map();let entry=globalThis.__chedarImageUsage.get(ip);
 if(!entry||now-entry.start>=windowMs)entry={start:now,count:0};
 if(entry.count>=3)return send(res,429,{error:"Batas sementara 3 gambar per 10 menit tercapai. Coba lagi nanti."});
 entry.count++;globalThis.__chedarImageUsage.set(ip,entry);
 const [width,height]=dimensions(clip(d.ratio,20));
 try{
  const form=new FormData();form.append("prompt",prompt);form.append("width",String(width));form.append("height",String(height));form.append("guidance","4");
  refs.forEach((im,i)=>{const bytes=Buffer.from(im.data,"base64");form.append("input_image_"+i,new Blob([bytes],{type:im.mime==="image/png"?"image/png":"image/jpeg"}),"reference-"+i+".jpg");});
  const response=await fetch("https://api.cloudflare.com/client/v4/accounts/"+encodeURIComponent(account)+"/ai/run/@cf/black-forest-labs/flux-2-klein-4b",{method:"POST",headers:{Authorization:"Bearer "+token},body:form});
  const type=response.headers.get("content-type")||"";
  if(!response.ok){const raw=await response.text().catch(()=> "");let msg="Cloudflare gagal membuat gambar ("+response.status+").";try{const j=JSON.parse(raw);msg=String(j.errors?.[0]?.message||j.error||msg).slice(0,300)}catch{}if(response.status===401||response.status===403)msg="Cloudflare menolak token atau izin Workers AI. Periksa API Token dan akses akun.";else if(response.status===429)msg="Kuota atau batas permintaan Cloudflare sedang tercapai. Coba lagi nanti.";return send(res,response.status===429?429:502,{error:msg});}
  let imageData="",mime="image/png";
  if(type.startsWith("image/")){const b=Buffer.from(await response.arrayBuffer());imageData=b.toString("base64");mime=type.split(";")[0];}
  else{const out=await response.json().catch(()=>({}));const result=out.result||out;imageData=String(result.image||result.data||"");if(!imageData&&typeof result==="string")imageData=result;if(!imageData)return send(res,502,{error:"Cloudflare merespons, tetapi data gambar tidak ditemukan. Coba lagi."});}
  imageData=imageData.replace(/^data:image\/[^;]+;base64,/,"");
  return send(res,200,{image:"data:"+mime+";base64,"+imageData,model:"FLUX.2 Klein 4B",width,height,referenceCount:refs.length});
 }catch(e){const cause=e?.cause?.code||e?.cause?.name||"";const detail=String(e?.message||"Unknown fetch error").slice(0,180);console.error("[CHEDAR_IMAGE_CLOUDFLARE_FETCH]",{message:detail,cause});return send(res,502,{error:"Koneksi ke Cloudflare gagal: "+detail+(cause?" ("+cause+")":"")+". Periksa log Preview jika masalah berlanjut."});}
}

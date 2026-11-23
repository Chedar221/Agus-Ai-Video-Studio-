function send(res,status,body){if(typeof res.status==="function")return res.status(status).json(body);res.statusCode=status;res.setHeader("Content-Type","application/json; charset=utf-8");res.end(JSON.stringify(body));}
const clip=(v,n)=>String(v??"").trim().slice(0,n);
const dimensions=(ratio)=>({"9:16":[768,1344],"16:9":[1344,768],"1:1":[1024,1024],"4:5":[832,1040],"3:4":[768,1024],"4:3":[1024,768],"3:2":[1024,682],"A4":[896,1264]}[ratio]||[1024,1024]);
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return send(res,405,{error:"Gunakan metode POST."});}
 let d=req.body;if(typeof d==="string"){try{d=JSON.parse(d)}catch{d=null}}
 if(!d||typeof d!=="object"||Array.isArray(d))return send(res,400,{error:"Data gambar tidak valid."});
 const token=process.env.CLOUDFLARE_API_TOKEN,account=process.env.CLOUDFLARE_ACCOUNT_ID;
 if(!token||!account)return send(res,503,{error:"Konfigurasi Cloudflare belum lengkap. Pastikan CLOUDFLARE_API_TOKEN dan CLOUDFLARE_ACCOUNT_ID tersedia di Vercel Preview."});
 const ratio=clip(d.ratio,20),kind=clip(d.type,30);const framing=ratio==="9:16"||ratio==="4:5"||ratio==="3:4"||ratio==="A4"?"PORTRAIT COMPOSITION: Put the main person or product hero slightly right of center, preserve a clean but visually rich left-side typography zone, keep the top 10 percent relatively calm for the original brand logo, and keep the lower 22 percent suitable for a compact information/CTA overlay. Do not place important faces or product details behind text zones.":ratio==="16:9"||ratio==="4:3"||ratio==="3:2"?"LANDSCAPE COMPOSITION: Place the main hero on the right half and preserve a deliberate left-side text-safe zone with strong depth and balanced negative space.":"SQUARE COMPOSITION: Use a bold centered hero with a clean upper band for brand identity and a lower band for concise campaign information.";const typeDirection=kind==="product"?"PRODUCT CAMPAIGN: make the actual product the unmistakable hero; preserve exact packaging, proportions, label colors and materials.":kind==="branding"?"BRAND IDENTITY: create a refined visual identity presentation with deliberate geometry and premium material cues; no fake logo artwork.":kind==="infographic"?"INFOGRAPHIC BACKGROUND: use restrained supporting visuals and modular visual zones; keep the center-left clear and avoid busy scenery.":kind==="thumbnail"?"VIDEO THUMBNAIL: one instantly readable hero subject, dramatic but clean separation, energetic framing, and a strong focal point.":"COMMERCIAL CAMPAIGN: create a distinctive, context-specific advertising photoshoot with believable props and environment.";const prompt=clip(d.prompt,1700)+"\n\nPRODUCTION ART DIRECTION: Generate ONLY the photographic visual artwork/background, not a finished text poster. "+typeDirection+" "+framing+" Create a visually rich premium campaign image with a clear hero subject, foreground/background depth, relevant supporting objects, polished cinematic or studio lighting, realistic materials, natural skin tones, refined color grading, and deliberate editorial composition. The result must feel like a high-budget commissioned campaign, not generic stock photography, clipart, or a plain gradient. If reference photos are supplied, use the supplied reference as a guide for subject, visual context, product shape, color and important details; keep people naturally and respectfully depicted. STRICTLY NO TEXT, LETTERS, WORDS, NUMBERS, TYPOGRAPHY, LOGOS, WATERMARKS, LABELS, SIGNS, UI, PHONE SCREEN TEXT, MOCKUP, OR POSTER FRAME. Never invent a brand mark, price, contact, or claim. The app will place exact typography and the original uploaded logo separately.";
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
  const requestImage=async(activePrompt)=>{const form=new FormData();form.append("prompt",activePrompt);form.append("width",String(width));form.append("height",String(height));form.append("guidance","4");refs.forEach((im,i)=>{const bytes=Buffer.from(im.data,"base64");form.append("input_image_"+i,new Blob([bytes],{type:im.mime==="image/png"?"image/png":"image/jpeg"}),"reference-"+i+".jpg");});return fetch("https://api.cloudflare.com/client/v4/accounts/"+encodeURIComponent(account)+"/ai/run/@cf/black-forest-labs/flux-2-klein-4b",{method:"POST",headers:{Authorization:"Bearer "+token},body:form});};
  let response=await requestImage(prompt);
  let rawError="";
  if(!response.ok){
   rawError=await response.text().catch(()=> "");
   if(/output has been flagged|flagged.*prompt|content.?moderation|safety.?filter/i.test(rawError)){
    // Retry once with a shorter, neutral art direction while retaining the user's reference images.
    const safePrompt=clip(d.prompt,900)+"\n\nCreate a safe, non-sensitive commercial advertising photograph. Follow the supplied reference image for general subject, colors and visual context. Show people fully clothed in an ordinary professional or everyday setting. Use natural, respectful poses and realistic lighting. Keep the composition polished and suitable for a general audience. Do not add text, logos, labels, watermarks, nudity, sexual content, violence, weapons, or disturbing elements.";
    response=await requestImage(safePrompt);
    if(!response.ok)rawError=await response.text().catch(()=>rawError);
   }
  }
  const type=response.headers.get("content-type")||"";
  if(!response.ok){let msg="Cloudflare gagal membuat gambar ("+response.status+").";try{const j=JSON.parse(rawError);msg=String(j.errors?.[0]?.message||j.error||msg).slice(0,300)}catch{}if(/output has been flagged|flagged.*prompt|content.?moderation|safety.?filter/i.test(rawError))return send(res,422,{error:"Gambar ditolak oleh filter keamanan AI setelah satu kali percobaan ulang. Foto referensi mungkin mengandung elemen yang sensitif bagi model. Coba gunakan foto yang lebih netral, subjek berpakaian biasa, dan prompt yang berfokus pada iklan umum. Foto referensi dan logo tidak perlu dihapus dari proyek; pilih ulang hanya jika memang menjadi pemicu."});if(response.status===401||response.status===403)msg="Cloudflare menolak token atau izin Workers AI. Periksa API Token dan akses akun.";else if(response.status===429)msg="Kuota atau batas permintaan Cloudflare sedang tercapai. Coba lagi nanti.";return send(res,response.status===429?429:502,{error:msg});}
  let imageData="",mime="image/png";
  if(type.startsWith("image/")){const b=Buffer.from(await response.arrayBuffer());imageData=b.toString("base64");mime=type.split(";")[0];}
  else{const out=await response.json().catch(()=>({}));const result=out.result||out;imageData=String(result.image||result.data||"");if(!imageData&&typeof result==="string")imageData=result;if(!imageData)return send(res,502,{error:"Cloudflare merespons, tetapi data gambar tidak ditemukan. Coba lagi."});}
  imageData=imageData.replace(/^data:image\/[^;]+;base64,/,"");
  return send(res,200,{image:"data:"+mime+";base64,"+imageData,model:"FLUX.2 Klein 4B",width,height,referenceCount:refs.length});
 }catch(e){const cause=e?.cause?.code||e?.cause?.name||"";const detail=String(e?.message||"Unknown fetch error").slice(0,180);console.error("[CHEDAR_IMAGE_CLOUDFLARE_FETCH]",{message:detail,cause});return send(res,502,{error:"Koneksi ke Cloudflare gagal: "+detail+(cause?" ("+cause+")":"")+". Periksa log Preview jika masalah berlanjut."});}
}

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
 const ratio=clip(d.ratio,20),kind=clip(d.type,30),brief=clip(d.brief,500);
 const framing=ratio==="9:16"||ratio==="4:5"||ratio==="3:4"||ratio==="A4"?"Portrait advertising photograph, 9:16-safe composition, one clear hero on the right, clean open space on the left for later graphic layout.":"Professional commercial advertising photograph, balanced composition with a clear hero and open space for later graphic layout.";
 const laundry=/(laundry|laundri|cuci kiloan|jasa cuci|binatu|setrika|dry clean|dry-clean)/i.test(brief+" "+clip(d.prompt,900));
 const referenceDirection=Array.isArray(d.images)&&d.images.length?"Use the uploaded reference photo as visual guidance for the relevant subject only. Preserve the real product or service context. Do not copy any text, logos, watermarks, decorative lettering, or layout from the reference.":"Create an original, context-appropriate advertising photograph based only on the user brief.";
 const laundryDirection="Create a photorealistic premium advertising photoshoot for a real laundry service in Indonesia. Show a friendly adult female laundry staff member in a neat modest uniform working in a clean modern laundry shop, with realistic front-loading washing machines, neatly folded fresh clothes, a tidy laundry basket and soft fabric textures. The laundry activity and service environment must be unmistakable. Use warm natural daylight, premium commercial photography, realistic adult human proportions and a confident welcoming expression. No children, no chibi, no cartoon, no mascot, no smartphone, no website, no ecommerce mockup, no unrelated product.";
 const generalDirection="Create a photorealistic premium commercial advertising photoshoot that clearly depicts the exact business, service or product named in the user's brief. Choose only believable props and a setting that directly belong to that business. Use realistic materials, professional studio or natural light, authentic proportions, refined color grading and a strong visual focal point. Do not invent a different product, service, mascot, character, device or setting.";
 const prompt=(laundry?laundryDirection:generalDirection)+" "+framing+" USER REQUEST: "+brief+" "+referenceDirection+" ABSOLUTE IMAGE RULE: generate a clean photographic background only. No text, no letters, no numbers, no fake words, no pseudo-writing, no logos, no brand names, no labels, no signage, no watermark, no typography, no poster copy, no graphic panels, no badges, no UI, no phone screen, no mockup. Leave copy and branding entirely to the website compositor. Do not reinterpret the brief as a cartoon or illustration. "+(laundry?"Use realistic adult people only; do not show a child or animated character.":"Use realistic photography, not illustration or 3D cartoon.")+" "+clip(d.prompt,500);
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

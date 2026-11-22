function send(res,status,body){if(typeof res.status==="function")return res.status(status).json(body);res.statusCode=status;res.setHeader("Content-Type","application/json; charset=utf-8");res.end(JSON.stringify(body));}
const TYPES={poster:"poster promosi atau acara",infographic:"infografis edukasi yang akurat dan mudah dipahami",social:"konten media sosial dan carousel",thumbnail:"thumbnail video dengan hook visual kuat",flyer:"flyer atau brosur informatif",branding:"identitas logo dan branding usaha",product:"desain iklan produk dan katalog",invitation:"undangan atau banner acara"};
const clip=(v,n)=>String(v??"").trim().slice(0,n);
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return send(res,405,{error:"Gunakan metode POST."});}
 let d=req.body;if(typeof d==="string"){try{d=JSON.parse(d)}catch{d=null}}
 if(!d||typeof d!=="object"||Array.isArray(d))return send(res,400,{error:"Data desain tidak valid."});
 const type=clip(d.type,30),title=clip(d.title,180),details=clip(d.details,5000);
 if(!TYPES[type])return send(res,400,{error:"Jenis desain tidak dikenal."});
 if(!title&&!details)return send(res,400,{error:"Isi judul atau informasi desain terlebih dahulu."});
 const key=process.env.GROQ_API_KEY;if(!key)return send(res,503,{error:"GROQ_API_KEY belum aktif di Vercel Preview."});
 const ip=String(req.headers?.["x-forwarded-for"]||req.headers?.["x-real-ip"]||"anonymous").split(",")[0].trim();
 const now=Date.now(),windowMs=10*60*1000;globalThis.__chedarDesignUsage||=new Map();let entry=globalThis.__chedarDesignUsage.get(ip);
 if(!entry||now-entry.start>=windowMs)entry={start:now,count:0};if(entry.count>=5)return send(res,429,{error:"Batas sementara 5 konsep per 10 menit tercapai. Coba lagi nanti."});entry.count++;globalThis.__chedarDesignUsage.set(ip,entry);
 const model=(process.env.GROQ_MODEL||"qwen/qwen3.8-27b").trim();
 const brief={jenis:TYPES[type],judul:title,audiens:clip(d.audience,300),format:clip(d.ratio,30),gaya:clip(d.style,120),warna:clip(d.color,160),informasi_wajib:details,arahan:clip(d.notes,2000),foto_referensi:Array.isArray(d.referenceImages)?d.referenceImages.slice(0,4).map(x=>clip(x,180)):[],logo_referensi:clip(d.logoReference,180)};
 const system="Anda adalah creative director, graphic designer, copywriter, dan art director profesional. Buat konsep desain berbahasa Indonesia. Jangan mengarang harga, tanggal, alamat, nomor kontak, klaim produk, statistik, atau fakta. Pertahankan ejaan dan angka yang diberikan pengguna. Jika informasi kurang, jangan isi dengan fakta rekaan; beri placeholder yang jelas seperti [TAMBAHKAN NOMOR KONTAK]. Keluaran harus berupa JSON valid saja dengan properti string: copyText, layout, visualPrompt. visualPrompt harus sangat terperinci dan siap ditempel ke generator gambar, mencakup format, hierarki visual, komposisi, tipografi, palet, pencahayaan, material, negative prompt, serta instruksi teks agar ditulis persis dan terbaca. Jika ada foto referensi, tuliskan instruksi agar pengguna melampirkannya pada generator gambar dan mempertahankan identitas, bentuk, warna, proporsi, serta detail utama. Jika ada logo referensi, instruksikan penggunaan file logo asli tanpa menggambar ulang, mengubah tulisan, warna, bentuk, atau proporsinya. Jangan mengklaim gambar telah dibuat.";
 try{
  const response=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model,messages:[{role:"system",content:system},{role:"user",content:"Buat konsep untuk brief berikut:\n"+JSON.stringify(brief)}],temperature:0.55,max_tokens:7000,response_format:{type:"json_object"}})});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok){const code=response.status;const message=code===401||code===403?"API Key Groq ditolak. Periksa konfigurasi GROQ_API_KEY di Vercel.":code===429?"Kuota atau rate limit Groq tercapai. Coba lagi nanti.":String(payload?.error?.message||"Groq API error ("+code+")").slice(0,350);return send(res,code>=500?502:code,{error:message});}
  const raw=String(payload.choices?.[0]?.message?.content||"");let result;try{result=JSON.parse(raw)}catch{return send(res,502,{error:"Groq mengembalikan format yang belum valid. Silakan coba sekali lagi."})}
  if(!["copyText","layout","visualPrompt"].every(k=>typeof result[k]==="string"&&result[k].trim()))return send(res,502,{error:"Hasil AI belum lengkap. Silakan coba lagi."});
  return send(res,200,{result,model,engine:"groq"});
 }catch{return send(res,502,{error:"Server tidak dapat menghubungi Groq. Coba lagi beberapa saat."});}
}
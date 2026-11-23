import { isAdminRequest } from "./_admin-session.js";

function send(res,status,body){
  if(typeof res.status==="function") return res.status(status).json(body);
  res.statusCode=status;res.setHeader("Content-Type","application/json; charset=utf-8");res.end(JSON.stringify(body));
}
const allowedTools=new Set(["character","storyboard","continuity","voice","music","auto"]);
function compact(value,max=9000){return String(value??"").slice(0,max);}
export default async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  if(req.method!=="POST"){if(typeof res.setHeader==="function")res.setHeader("Allow","POST");return send(res,405,{error:"Gunakan metode POST."});}
  let d=req.body;if(typeof d==="string"){try{d=JSON.parse(d);}catch{d=null;}}
  if(!d||typeof d!=="object"||Array.isArray(d)||!allowedTools.has(d.tool))return send(res,400,{error:"Permintaan fitur produksi tidak valid."});
  const requestedEngine=String(d.aiEngine||"gemini").toLowerCase();
  const supportedEngines=["gemini","openai","groq","openrouter"];
  if(!supportedEngines.includes(requestedEngine))return send(res,400,{error:"Pilihan mesin AI tidak dikenal."});
  const useOpenAI=requestedEngine==="openai";
  const useCompatibleAPI=["openai","groq","openrouter"].includes(requestedEngine);
  const keyName={gemini:"GEMINI_API_KEY",openai:"OPENAI_API_KEY",groq:"GROQ_API_KEY",openrouter:"OPENROUTER_API_KEY"}[requestedEngine];
  const apiKey=process.env[keyName];
  if(!apiKey)return send(res,503,{error:keyName+" belum dipasang atau belum aktif di Vercel."});
  const tool=d.tool;
  // Auto pipeline is available to ordinary users; individual production tools remain admin-only.
  if(tool!=="auto"&&!isAdminRequest(req)) return send(res,401,{error:"Fitur produksi individual hanya tersedia untuk admin."});
  if(tool==="auto"&&!isAdminRequest(req)){
    const forwarded=String(req.headers?.["x-forwarded-for"]||"").split(",")[0].trim();
    const key=forwarded||String(req.headers?.["x-real-ip"]||"anonymous");
    const now=Date.now(),windowMs=10*60*1000,maxRequests=2;
    globalThis.__chedarAutoUsage ||= new Map();
    const usage=globalThis.__chedarAutoUsage;
    let entry=usage.get(key);
    if(!entry||now-entry.startedAt>=windowMs) entry={startedAt:now,count:0};
    if(entry.count>=maxRequests) return send(res,429,{error:"Batas pembuatan otomatis sementara tercapai. Tunggu 10 menit sebelum mencoba lagi."});
    entry.count++;usage.set(key,entry);
    if(usage.size>1000){for(const [ip,item] of usage)if(now-item.startedAt>=windowMs)usage.delete(ip);}
  }
  const title=compact(d.title,180)||"Proyek video";
  const idea=compact(d.idea,5000);
  const project=d.project&&typeof d.project==="object"?d.project:null;
  const projectText=project?JSON.stringify(project).slice(0,16000):"Belum ada proyek aktif."
  const details=JSON.stringify(d[tool]||d).slice(0,10000);
  const rules="Gunakan Bahasa Indonesia. Hasil praktis, profesional, konsisten, dan tidak bertele-tele. Prompt video Flow per scene maksimal 3.000 karakter; hindari instruksi yang berulang. Scene terakhir wajib menyelesaikan cerita. Jangan mengklaim media sudah dirender atau menjanjikan wajah identik sempurna. Foto master reference yang sama harus dilampirkan pada setiap klip. Jangan mengarang fakta. Berikan heading jelas.";
  const prompts={
    character:"Bertindak sebagai character designer dan continuity supervisor film. Buat CHARACTER BIBLE profesional berisi identitas visual yang dapat diamati, ciri pembeda, siluet, proporsi, rambut, pakaian, aksesori, properti, ekspresi, aturan konsistensi, larangan perubahan, prompt character sheet sesuai format yang dipilih (front/back/left/right atau pilihan lain), prompt ekspresi, serta prompt master reference Google Flow. Sediakan juga prompt ringkas untuk ditempel di setiap scene. Jika deskripsi kosong, instruksikan mengikuti foto referensi dan jangan menebak detail. Data karakter: "+details,
    storyboard:"Bertindak sebagai sutradara, storyboard artist, dan sinematografer. Buat storyboard tepat sebanyak panel yang diminta. Untuk setiap panel berikan timecode/estimasi durasi, beat cerita, tujuan dramatik, ukuran shot, angle, komposisi, blocking, aksi, ekspresi, gerakan kamera, lighting, transisi ke panel berikutnya, dan prompt gambar mandiri yang siap ditempel ke generator gambar. Jaga screen direction, sumbu 180 derajat, eyeline, lokasi, wardrobe, dan kontinuitas properti. Cerita: "+idea+"\nProyek aktif: "+projectText+"\nArahan: "+details,
    continuity:"Bertindak sebagai continuity supervisor yang kritis. Audit proyek scene demi scene, bukan sekadar memberi checklist umum. Periksa identitas karakter, wajah/rambut, wardrobe/aksesori, properti/kendaraan, lokasi/waktu/cuaca, arah cahaya, blocking, screen direction, eyeline, geografi ruang, transisi, durasi/timecode, narasi/dialog, karakter suara, musik dan ambience. Beri status PASS / WARNING / FAIL, tunjukkan nomor adegan dan bukti teks spesifik dari prompt yang diperiksa. Bedakan masalah yang terbukti dari hal yang tidak dapat diverifikasi hanya dari teks. Akhiri dengan daftar perbaikan prioritas dan kalimat prompt koreksi yang siap ditempel. Proyek: "+projectText+"\nKriteria yang dipilih: "+details+"\nCatatan: "+compact(d.notes,2000),
    voice:"Bertindak sebagai voice director, dialog coach, dan audio post-production supervisor. Buat VOICE BIBLE dengan jenis suara, timbre, pitch, aksen, artikulasi, tempo, jeda, dinamika, emosi, jarak mikrofon, konsistensi antar-klip, serta aturan pemisahan voice-over dan dialog on-screen. Jika proyek memiliki scene, buat arahan performa per scene dan pertahankan teks narasi/dialog verbatim. Jangan mengubah gender tokoh visual karena pilihan suara. Beri prompt audio siap tempel ke Google Flow. Pengaturan suara: "+details+"\nProyek: "+projectText,
    music:"Bertindak sebagai film composer, music supervisor, dan sound designer. Buat MUSIC BIBLE, Suno Style of Music prompt ringkas berbahasa Inggris, struktur musik dari opening hingga ending, tempo/energi, instrumen, karakter vokal, arahan mixing, serta cue sheet musik dan SFX per adegan. Tandai kapan musik naik/turun dan kapan harus ducking agar narasi/dialog tetap jelas. Jangan meniru artis atau lagu yang sudah ada. Jika instrumental dipilih, pastikan no vocals/no lyrics. Pengaturan musik: "+details+"\nProyek: "+projectText
  };
  if(tool==="auto") prompts.auto="Bertindaklah sebagai AI FILM DIRECTOR yang mengorkestrasi LIMA departemen sekaligus. Pengguna hanya memberi satu ide sederhana. Buat kelima keluaran saling cocok dan merujuk proyek yang sama. Kembalikan HANYA JSON valid tanpa markdown, dengan tepat lima string properti: character, storyboard, continuity, voice, music. Bahasa Indonesia, rinci tetapi praktis.\nCHARACTER: Character Bible, identitas visual berdasar character lock yang disediakan, pakaian/properti, ekspresi, negative lock, prompt master reference Flow, dan aturan foto referensi yang sama harus dilampirkan pada setiap klip. Jangan mengarang ciri foto yang tidak diberikan.\nSTORYBOARD: storyboard lengkap mengikuti semua adegan proyek, dengan timecode, tujuan, shot size/angle, komposisi, blocking, aksi, ekspresi, kamera, lighting, transisi, serta prompt gambar siap pakai per adegan. Jumlah adegan harus sama dengan proyek.\nCONTINUITY: audit semua adegan dan keluarkan PASS/WARNING/FAIL dengan bukti spesifik dari data proyek, daftar masalah, perbaikan prioritas dan prompt koreksi. Jangan mengklaim bisa memeriksa visual render; hanya teks/prompt.\nVOICE: Voice Bible konsisten berdasarkan bahasa, gender/karakter suara, emosi, tempo, artikulasi. Pisahkan narasi off-screen dan dialog on-screen; jangan ubah teks dialog/narasi yang sudah ada. Arahan audio per adegan dan prompt Flow.\nMUSIC: Music Bible, Suno Style of Music prompt singkat dalam bahasa Inggris, genre/mood/instrumen/vokal/tempo, struktur musik, cue musik dan SFX per adegan, mixing/ducking supaya dialog jelas. Jangan meniru artis atau lagu yang ada.\nSemua kelima keluaran harus menggunakan judul, karakter, lokasi, genre, durasi, dan adegan yang sama. Jangan menyatakan render video/gambar/audio telah dibuat."+"\n\nIDE PENGGUNA: "+idea+"\nJUDUL: "+title+"\nPENGATURAN DAN KARAKTER: "+JSON.stringify(d.settings||{}).slice(0,9000)+"\nPROYEK DAN ADEGAN: "+projectText+"\nARAHAN TAMBAHAN: "+JSON.stringify(d.auto||{}).slice(0,5000);
  const model=({openai:process.env.OPENAI_MODEL||"gpt-4.1-mini",gemini:process.env.GEMINI_MODEL||"gemini-3.8-flash",groq:process.env.GROQ_MODEL||"qwen/qwen3.8-27b",openrouter:process.env.OPENROUTER_MODEL||"openrouter/free"})[requestedEngine].trim();
  try{
    let payload,result;
    if(useCompatibleAPI){
      const endpoint=requestedEngine==="openai"?"https://api.openai.com/v1/chat/completions":requestedEngine==="groq"?"https://api.groq.com/openai/v1/chat/completions":"https://openrouter.ai/api/v1/chat/completions";
      const headers={Authorization:"Bearer "+apiKey,"Content-Type":"application/json"};
      if(requestedEngine==="openrouter"){headers["HTTP-Referer"]="https://agus-ai-video-studio.vercel.app";headers["X-Title"]="CHEDAR AI STUDIO";}
      const response=await fetch(endpoint,{method:"POST",headers,body:JSON.stringify({model,messages:[{role:"user",content:prompts[tool]+"\n\nATURAN UMUM: "+rules}],...(tool==="auto"?{response_format:{type:"json_object"}}:{}),temperature:0.45,max_tokens:tool==="auto"?(requestedEngine==="groq"?16000:24000):9000})});
      payload=await response.json().catch(()=>({}));
      if(!response.ok){const code=response.status;const provider={openai:"OpenAI",groq:"Groq",openrouter:"OpenRouter"}[requestedEngine];const message=code===401||code===403?"API Key "+provider+" ditolak. Periksa "+keyName+" di Vercel.":code===429?"Kuota atau rate limit "+provider+" tercapai. Coba lagi nanti atau pilih mesin lain.":(payload?.error?.message||provider+" API error ("+code+")").slice(0,400);return send(res,code>=500?502:code,{error:message});}
      result=String(payload.choices?.[0]?.message?.content||"").trim();
    }else{
      const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(model)+":generateContent",{method:"POST",headers:{"x-goog-api-key":apiKey,"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:prompts[tool]+"\n\nATURAN UMUM: "+rules}]}],generationConfig:{temperature:0.45,maxOutputTokens:tool==="auto"?24000:9000,...(tool==="auto"?{responseMimeType:"application/json"}:{})}})});
      payload=await response.json().catch(()=>({}));
      if(!response.ok){const code=response.status;const message=code===401||code===403?"API Key Gemini ditolak. Periksa GEMINI_API_KEY di Vercel.":code===404?"Model Gemini tidak tersedia. Periksa GEMINI_MODEL di Vercel.":code===429?"Batas penggunaan Gemini tercapai. Coba lagi nanti.":(payload?.error?.message||"Gemini API error ("+code+")").slice(0,400);return send(res,code>=500?502:code,{error:message});}
      result=(payload.candidates?.[0]?.content?.parts||[]).map(x=>x.text||"").join("\n").trim();
    }
    if(!result)return send(res,502,{error:"AI tidak mengembalikan hasil. Silakan coba lagi."});
    if(tool==="auto"){
      let results;
      try{results=JSON.parse(result);}catch{const match=result.match(/\{[\s\S]*\}/);if(match){try{results=JSON.parse(match[0]);}catch{}}}
      const keys=["character","storyboard","continuity","voice","music"];
      if(!results||keys.some(key=>typeof results[key]!=="string"||!results[key].trim()))return send(res,502,{error:"AI belum berhasil mengembalikan kelima hasil dalam format lengkap. Coba jalankan lagi."});
      return send(res,200,{tool,results,engine:requestedEngine,model});
    }
    return send(res,200,{result:result.slice(0,22000),tool,engine:requestedEngine,model});
  }catch{return send(res,502,{error:"Server tidak dapat menghubungi mesin AI yang dipilih. Coba lagi beberapa saat."});}
}
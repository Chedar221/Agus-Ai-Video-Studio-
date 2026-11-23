// Gemini 3.8 Flash TTS — server-side audio generation
function send(res,status,body){if(typeof res.status==="function")return res.status(status).json(body);res.statusCode=status;res.setHeader("Content-Type","application/json; charset=utf-8");res.end(JSON.stringify(body));}
export default async function handler(req,res){
 if(req.method!=="POST"){if(typeof res.setHeader==="function")res.setHeader("Allow","POST");return send(res,405,{error:"Gunakan metode POST."});}
 let d=req.body;if(typeof d==="string"){try{d=JSON.parse(d)}catch{d=null}}
 if(!d||typeof d!=="object"||Array.isArray(d))return send(res,400,{error:"Data audio tidak valid."});
 const text=String(d.text||"").trim().slice(0,3500);
 if(!text)return send(res,400,{error:"Teks audio masih kosong."});
 const voice=String(d.voice||"Kore");
 const allowed=["Kore","Puck","Charon","Fenrir","Aoede","Leda","Orus","Zephyr"];
 if(!allowed.includes(voice))return send(res,400,{error:"Pilihan suara tidak dikenal."});
 const key=process.env.GEMINI_API_KEY;
 if(!key)return send(res,503,{error:"GEMINI_API_KEY belum dipasang di Vercel."});
 try{
  const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent",{method:"POST",headers:{"x-goog-api-key":key,"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text}]}],generationConfig:{responseModalities:["AUDIO"],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:voice}}}}})});
  const data=await response.json();
  if(!response.ok){const detail=data?.error?.message||"Gemini TTS tidak dapat memproses audio.";return send(res,response.status,{error:detail.slice(0,350)});}
  const audio=data?.candidates?.[0]?.content?.parts?.find(p=>p.inlineData?.data)?.inlineData?.data;
  if(!audio)return send(res,502,{error:"Gemini tidak mengembalikan data audio. Coba lagi dengan teks lebih pendek."});
  return send(res,200,{audio,mimeType:"audio/wav",voice,model:"gemini-3.8-flash-tts"});
 }catch(error){return send(res,502,{error:"Koneksi ke layanan audio gagal: "+String(error?.message||error).slice(0,250)});}
}

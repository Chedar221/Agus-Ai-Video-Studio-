/* AGUS AI VIDEO STUDIO — Storyboard Studio, Character Consistency PRO, Prompt Library */
(() => {
 const $ = id => document.getElementById(id);
 const library = [
  {name:"Cinematic realistis",category:"visual",text:"Ultra-realistic cinematic film still, natural human proportions, authentic skin texture, physically accurate lighting, restrained color grading, detailed environment, professional feature-film composition."},
  {name:"Dark cinematic",category:"visual",text:"Dark cinematic atmosphere, controlled deep shadows, dramatic contrast, subtle atmospheric haze, motivated lighting, rich black levels, realistic film grain, premium thriller cinematography."},
  {name:"Dokumenter natural",category:"visual",text:"Observational documentary visual language, authentic location details, natural available light, candid human expressions, grounded camera behavior, realistic colors."},
  {name:"Golden hour hangat",category:"visual",text:"Warm golden-hour sunlight, soft directional highlights, gentle shadows, natural skin tones, subtle lens bloom, cinematic warm color grade."},
  {name:"Close-up emosional",category:"camera",text:"Intimate close-up shot, eye-level camera, subtle slow push-in, sharp focus on the subject's eyes, shallow depth of field, natural micro-expressions, stable framing."},
  {name:"Tracking shot halus",category:"camera",text:"Smooth cinematic tracking shot following the subject at a natural pace, stable gimbal movement, consistent screen direction, realistic parallax, no sudden camera jumps."},
  {name:"Establishing wide shot",category:"camera",text:"Wide establishing shot introducing the location, subject placement and geography, cinematic composition, slow controlled camera movement, readable environment."},
  {name:"Drone aerial",category:"camera",text:"High-quality drone aerial establishing shot, smooth controlled forward movement, realistic scale and geography, stable horizon, natural motion."},
  {name:"Low-key malam",category:"lighting",text:"Low-key night lighting with motivated practical light sources, realistic street lamps and reflections, preserved shadow detail, controlled highlights, cinematic night atmosphere."},
  {name:"Soft portrait lighting",category:"lighting",text:"Soft flattering key light, gentle fill, subtle rim separation, natural skin texture, accurate skin tone, smooth shadow transitions."},
  {name:"Cahaya dramatis",category:"lighting",text:"Dramatic directional lighting, strong but natural contrast, motivated light source, sculpted shadows, controlled highlights, atmospheric depth."},
  {name:"Flow continuity lock",category:"flow",text:"Maintain the exact same character identity, face, hairstyle, wardrobe, accessories and key props throughout the entire clip. Preserve spatial continuity and screen direction. No flicker, morphing or identity drift."},
  {name:"Flow natural motion",category:"flow",text:"Natural human movement with believable weight, timing and body mechanics. Keep hands and fingers anatomically correct. Avoid jitter, frame flicker, sudden pose changes, warped objects and unnatural facial movement."},
  {name:"Flow clean frame",category:"flow",text:"Clean cinematic frame, coherent background geometry, stable object shapes, realistic depth, no random text, no subtitles unless requested, no logos and no watermark."},
  {name:"Horor atmosferik",category:"genre",text:"Atmospheric psychological horror, slow-building tension, restrained unsettling details, ominous composition, realistic environment, no cheap visual effects."},
  {name:"Promosi wisata Bali",category:"genre",text:"Premium Bali travel commercial, authentic Balinese environment and cultural details, welcoming human presence, beautiful natural scenery, polished tourism cinematography, respectful cultural representation."},
  {name:"Motivasi menyentuh",category:"genre",text:"Emotionally grounded inspirational drama, sincere human performance, gradual emotional build, intimate visual storytelling, hopeful but realistic ending."},
  {name:"Komedi ekspresif",category:"genre",text:"Lighthearted cinematic comedy, clear readable facial expressions, natural physical timing, believable reactions, clean staging and playful pacing."}
 ];
 const catNames={visual:"Gaya visual",camera:"Kamera & shot",lighting:"Pencahayaan",flow:"Kualitas Google Flow",genre:"Genre & suasana"};
 const originalFallbackTemplate=fallbackTemplate;
 fallbackTemplate=function(){
  const p=originalFallbackTemplate();
  const lock=["FACE IDENTITY LOCK: "+$("faceLock").value,"WARDROBE AND PROP LOCK: "+$("wardrobeLock").value,"NEGATIVE CHARACTER CONSTRAINTS: "+$("negativeLock").value].filter(Boolean).join("\n");
  p.globalCharacterLock=[p.globalCharacterLock,lock].filter(Boolean).join("\n");
  p.scenes.forEach(s=>{s.imagePrompt+="\n\n"+lock;s.videoPrompt+="\n\n"+lock;});
  return p;
 };
 function renderLibrary(){
  const host=$("promptResults");if(!host)return;
  const cat=$("promptCategory")?.value||"all",q=($("promptSearch")?.value||"").toLowerCase().trim();
  const rows=library.filter(x=>(cat==="all"||x.category===cat)&&(!q||(x.name+" "+x.text+" "+catNames[x.category]).toLowerCase().includes(q)));
  host.innerHTML=rows.length?rows.map(x=>'<article class="promptLibraryCard"><b>'+x.name+' · '+catNames[x.category]+'</b><p>'+x.text+'</p><div class="actions"><button class="secondary" data-lib-copy="'+library.indexOf(x)+'">Salin</button><button class="gold" data-lib-use="'+library.indexOf(x)+'">Tambahkan</button></div></article>').join(""):'<div class="empty">Tidak ada template yang cocok.</div>';
  host.querySelectorAll("[data-lib-copy]").forEach(b=>b.onclick=()=>copyText(library[Number(b.dataset.libCopy)].text,"Prompt berhasil disalin."));
  host.querySelectorAll("[data-lib-use]").forEach(b=>b.onclick=()=>usePrompt(library[Number(b.dataset.libUse)]));
 }
 async function copyText(value,msg){
  try{await navigator.clipboard.writeText(value);$("promptLibraryStatus").textContent=msg;}
  catch{$("promptLibraryStatus").textContent="Clipboard tidak tersedia. Salin teks secara manual.";}
 }
 function usePrompt(item){
  const f=$("extra"),old=f.value.trim();f.value=(old?old+"\n\n":"")+"["+item.name+"]\n"+item.text;
  $("promptLibraryStatus").textContent='"'+item.name+'" ditambahkan ke Arahan tambahan.';
  f.scrollIntoView({behavior:"smooth",block:"center"});
 }
 $("promptCategory")?.addEventListener("change",renderLibrary);
 $("promptSearch")?.addEventListener("input",renderLibrary);
 $("promptLibraryBtn")?.addEventListener("click",()=>$("promptLibrary").scrollIntoView({behavior:"smooth",block:"start"}));
 $("storyboardBuild")?.addEventListener("click",()=>{
  $("scenes").value=$("storyboardCount").value;
  if($("storyboardMode").value==="template")$("templateBtn").click();else $("aiBtn").click();
 });
 $("storyboardCopy")?.addEventListener("click",()=>{
  if(typeof project==="undefined"||!project?.scenes?.length){$("status").textContent="Buat storyboard terlebih dahulu.";return;}
  const txt=project.scenes.map(s=>"PANEL "+s.number+" | "+s.timecode+"\n"+s.purpose+"\nVISUAL: "+s.visual+"\nPROMPT GAMBAR: "+s.imagePrompt+"\nPROMPT VIDEO: "+s.videoPrompt).join("\n\n--------------------\n\n");
  copyText(txt,"Semua prompt storyboard berhasil disalin.");
 });
 $("copyStoryboard")?.addEventListener("click",()=>$("storyboardCopy")?.click());
 $("applyCharacterLock")?.addEventListener("click",()=>{
  const parts=[$("faceLock").value,$("wardrobeLock").value,$("negativeLock").value].filter(Boolean);
  const lock="CHEDAR_CHARACTER_LOCK\n"+parts.join("\n");
  const stripLock=value=>String(value||"").replace(/(?:^|\n\n)CHEDAR_CHARACTER_LOCK[\s\S]*?(?=\n\n|$)/g,"").trim();
  $("character").value=[$("character").value.trim(),...parts].filter(Boolean).join("\n\n");
  $("continuity").value=[$("continuity").value.trim(),"Terapkan seluruh kunci identitas, pakaian, properti, dan larangan perubahan di setiap adegan."].filter(Boolean).join("\n");
  if(typeof project!=="undefined"&&project?.scenes?.length){
   project.globalCharacterLock=[stripLock(project.globalCharacterLock),lock].filter(Boolean).join("\n\n");
   project.scenes.forEach(scene=>{
    for(const key of ["imagePrompt","videoPrompt"]){
     scene[key]=[stripLock(scene[key]),lock].filter(Boolean).join("\n\n");
    }
   });
   if(typeof render==="function")render();
   try{
    const stored=JSON.parse(localStorage.getItem("agusStudioProjects")||"[]");
    const item=stored.find(entry=>Number(entry.id)===Number(activeProjectId));
    if(item){item.project=project;item.form=typeof getData==="function"?getData():item.form;localStorage.setItem("agusStudioProjects",JSON.stringify(stored));localStorage.setItem("agusStudioLastProject",JSON.stringify(item));}
   }catch(error){console.warn("Penyimpanan kunci karakter gagal",error);}
  }
  $("status").textContent=typeof project!=="undefined"&&project?.scenes?.length?"Kunci karakter diterapkan ke semua prompt adegan dan proyek diperbarui.":"Kunci karakter disiapkan untuk paket video berikutnya.";
 });
 $("resetCharacterLock")?.addEventListener("click",()=>{
  $("faceLock").value="Gunakan satu identitas karakter yang sama di seluruh adegan. Pertahankan struktur wajah, jarak mata, bentuk alis, hidung, bibir, rahang, warna kulit, garis rambut, dan usia visual.";
  $("wardrobeLock").value="Pakaian, aksesori, kendaraan, dan properti utama harus sama antaradegan kecuali perubahan memang diminta dalam cerita.";
  $("negativeLock").value="No face morphing, no identity drift, no age change, no hairstyle change, no wardrobe changes, no duplicate character, no distorted face or hands.";
  $("status").textContent="Kunci karakter standar dipulihkan.";
 });
 renderLibrary();
})();
/* CHEDAR AI STUDIO — Scene Repair & Poster Prompt Maker */
(function(){
  "use strict";
  const $id = id => document.getElementById(id);
  const escHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function ensurePosterStudio(){
    if($id("posterPromptStudio")) return;
    const saved = $id("savedProjects");
    if(!saved) return;
    const section = document.createElement("section");
    section.className = "panel";
    section.id = "posterPromptStudio";
    section.innerHTML = `
      <h3><span class="num">✦</span> Thumbnail & Poster Maker</h3>
      <p class="hint">Buat prompt cover video atau poster 9:16 berdasarkan proyek aktif. Prompt dapat disalin ke generator gambar pilihanmu.</p>
      <div class="grid">
        <div class="field"><label for="posterFormat">FORMAT DESAIN</label><select id="posterFormat"><option value="vertical 9:16 TikTok/Reels cover">Vertikal 9:16 · TikTok / Reels</option><option value="horizontal 16:9 cinematic poster">Horizontal 16:9 · YouTube</option><option value="square 1:1 social media cover">Persegi 1:1 · Feed</option></select></div>
        <div class="field"><label for="posterStyle">GAYA VISUAL</label><select id="posterStyle"><option>Cinematic premium, dramatic lighting</option><option>Photorealistic commercial advertising</option><option>3D chibi animation, polished and colorful</option><option>Dark supernatural horror, atmospheric</option><option>Minimalist luxury editorial design</option></select></div>
      </div>
      <div class="field"><label for="posterTitle">JUDUL POSTER</label><input id="posterTitle" placeholder="Judul cover video"></div>
      <div class="field"><label for="posterText">TEKS TAMBAHAN (OPSIONAL)</label><input id="posterText" placeholder="Tagline, nama brand, atau CTA"></div>
      <div class="actions"><button type="button" class="gold small" id="posterBuild">✦ Susun Prompt Poster</button><button type="button" class="secondary small" id="posterCopy">Salin Prompt</button></div>
      <div class="field"><label for="posterPromptOutput">PROMPT GAMBAR</label><textarea id="posterPromptOutput" rows="6" placeholder="Prompt poster akan muncul di sini..."></textarea></div>
      <div class="status" id="posterStatus" role="status">Pilih gaya desain dan susun prompt poster.</div>`;
    saved.parentNode.insertBefore(section, saved.nextSibling);
    $id("posterBuild").addEventListener("click", buildPosterPrompt);
    $id("posterCopy").addEventListener("click", async()=>{
      const value=$id("posterPromptOutput").value.trim();
      if(!value){$id("posterStatus").textContent="Susun prompt poster terlebih dahulu.";return;}
      try{await navigator.clipboard.writeText(value);$id("posterStatus").textContent="Prompt poster berhasil disalin.";}
      catch{$id("posterStatus").textContent="Clipboard tidak tersedia. Salin teks secara manual.";}
    });
  }
  function buildPosterPrompt(){
    const active = typeof project !== "undefined" ? project : null;
    const title = $id("posterTitle").value.trim() || active?.title || "Judul Video";
    const idea = active?.logline || active?.synopsis || (typeof $ === "function" ? $("quickIdea")?.value : "") || "Visual utama sesuai tema video";
    const format = $id("posterFormat").value;
    const style = $id("posterStyle").value;
    const tagline = $id("posterText").value.trim();
    const prompt = [
      "Create a professional "+format+" cover poster for a video.",
      "Main title text must read exactly: "+title+".",
      tagline ? "Additional text must read exactly: "+tagline+"." : "Do not add any extra text.",
      "Story and visual subject: "+idea+".",
      "Visual direction: "+style+".",
      "Strong visual hierarchy, clear focal subject, polished composition, premium typography, readable text, balanced negative space, high detail, professional color grading.",
      "Keep all important text inside safe margins. Correct spelling only. No random letters, no extra logos, no watermark."
    ].join(" ");
    $id("posterPromptOutput").value=prompt;
    $id("posterStatus").textContent="Prompt poster siap. Periksa judul dan teks sebelum digunakan.";
  }
  function attachSceneRepair(){
    const host=$id("videoView");
    if(!host || host.dataset.repairReady==="1") return;
    host.dataset.repairReady="1";
    host.addEventListener("click", event=>{
      const button=event.target.closest("[data-scene-repair]");
      if(!button) return;
      const number=Number(button.dataset.sceneRepair);
      const scene=typeof project!=="undefined" ? project?.scenes?.find(item=>Number(item.number)===number) : null;
      if(!scene) return;
      const card=button.closest(".scene");
      let editor=card.querySelector(".sceneRepairEditor");
      if(editor){editor.remove();button.textContent="✎ Perbaiki prompt scene";return;}
      editor=document.createElement("div");
      editor.className="sceneRepairEditor";
      editor.style.cssText="margin-top:12px;padding:12px;border:1px solid #b99a5a66;border-radius:12px;background:#0b1421";
      editor.innerHTML='<label style="display:block;margin-bottom:7px;color:#e8cf98;font-weight:800;font-size:11px">EDIT PROMPT ADEGAN '+number+'</label><textarea rows="8" style="width:100%;box-sizing:border-box" aria-label="Edit prompt scene">'+escHtml(scene.videoPrompt)+'</textarea><div class="actions" style="margin-top:8px"><button type="button" class="gold small" data-save-scene="'+number+'">Simpan perbaikan</button><button type="button" class="secondary small" data-cancel-scene>Batalkan</button></div><p class="hint">Perubahan ini memperbarui prompt scene pada proyek aktif. Tidak menjalankan render video.</p>';
      card.appendChild(editor);
      button.textContent="Tutup editor";
    });
    host.addEventListener("click", event=>{
      const save=event.target.closest("[data-save-scene]");
      if(save){
        const number=Number(save.dataset.saveScene);
        const scene=typeof project!=="undefined" ? project?.scenes?.find(item=>Number(item.number)===number) : null;
        const editor=save.closest(".sceneRepairEditor");
        const value=editor?.querySelector("textarea")?.value.trim();
        if(!scene || !value){if(typeof setStatus==="function")setStatus("Prompt tidak boleh kosong.","err");return;}
        scene.videoPrompt=value;
        if(typeof render==="function")render();
        if(typeof autoSaveProject==="function")autoSaveProject();
        if(typeof setStatus==="function")setStatus("Prompt adegan "+number+" berhasil diperbarui dan disimpan di perangkat.","ok");
      }
      const cancel=event.target.closest("[data-cancel-scene]");
      if(cancel){const editor=cancel.closest(".sceneRepairEditor");const card=cancel.closest(".scene");editor?.remove();const repair=card?.querySelector("[data-scene-repair]");if(repair)repair.textContent="✎ Perbaiki prompt scene";}
    });
  }
  function addRepairButtons(){
    const host=$id("videoView");
    if(!host) return;
    host.querySelectorAll(".scene").forEach(card=>{
      const copyButton=card.querySelector("[data-copy-scene]");
      if(!copyButton || card.querySelector("[data-scene-repair]")) return;
      const number=Number(copyButton.dataset.id);
      const button=document.createElement("button");
      button.type="button";button.className="secondary small";button.dataset.sceneRepair=String(number);button.textContent="✎ Perbaiki prompt scene";
      copyButton.parentNode.appendChild(button);
    });
  }
  function init(){
    ensurePosterStudio();
    attachSceneRepair();
    addRepairButtons();
    const host=$id("videoView");
    if(host) new MutationObserver(addRepairButtons).observe(host,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
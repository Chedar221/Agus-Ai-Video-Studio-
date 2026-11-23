/* CHEDAR AI KREATOR — Five integrated production director tools */
(() => {
  if (document.getElementById("chedarProductionSuite")) return;
  const host = document.getElementById("quickStudio");
  if (!host) return;

  const style = document.createElement("style");
  style.textContent = `
    #chedarProductionSuite{display:none!important;margin-top:18px;border:1px solid #c7a35b66;border-radius:17px;background:linear-gradient(145deg,#1a293d,#0e1725);overflow:hidden}
    #chedarProductionSuite .suiteHead{padding:15px 14px;border-bottom:1px solid #c5a15a35}
    #chedarProductionSuite .suiteHead strong{display:block;color:#f0d8a5;font-size:14px;letter-spacing:.04em}
    #chedarProductionSuite .suiteHead p{margin:5px 0 0;color:#aebdce;font-size:11px;line-height:1.5}
    #chedarProductionSuite .suiteTabs{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:11px 12px 8px}
    #chedarProductionSuite .suiteTabs.open{display:grid}
    #chedarProductionSuite .suiteTab{width:100%;min-width:0;min-height:44px;display:flex;align-items:center;justify-content:center;text-align:center;white-space:normal;background:#101c2b;border:1px solid #3d5067;color:#cbd5e1;border-radius:9px;padding:9px 8px;font-size:10px;font-weight:800;box-sizing:border-box}
    #chedarProductionSuite .suiteTab.active{background:linear-gradient(135deg,#f0dba9,#c49a58);border-color:#e6cc96;color:#17202c}\n    #chedarProductionSuite #suiteRunAll{grid-column:1/-1;width:100%;min-height:44px;border-radius:9px;padding:9px 12px;font-size:10px;font-weight:850;box-sizing:border-box}
    #chedarProductionSuite .suiteBody{padding:8px 13px 14px}
    #chedarProductionSuite .suitePane{display:none}
    #chedarProductionSuite .suitePane.active{display:block}
    #chedarProductionSuite .suiteToggle{width:100%;min-height:48px;margin-top:11px;display:flex;align-items:center;gap:10px;padding:13px 14px;background:linear-gradient(120deg,#292318,#121d2d);border:1px solid #c9a86688;border-radius:12px;color:#f0d9a6;text-align:left;font-size:12px;font-weight:900;letter-spacing:.05em;line-height:20px;box-sizing:border-box}
    #chedarProductionSuite .suiteToggle[aria-expanded="true"]{background:linear-gradient(120deg,#292318,#121d2d);color:#f0d9a6}\n    #chedarProductionSuite .suiteToggle span{margin-left:auto;font-size:20px;font-weight:400;line-height:1;letter-spacing:0}
    #chedarProductionSuite .suitePane h4{font-size:13px;color:#f0d8a5;margin:6px 0 10px}
    #chedarProductionSuite .suiteGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 10px}
    #chedarProductionSuite .suiteField{margin:0 0 10px;min-width:0}
    #chedarProductionSuite .suiteField.full{grid-column:1/-1}
    #chedarProductionSuite .suiteField label{display:block;font-size:10px;font-weight:800;color:#c9d5e3;margin-bottom:5px}
    #chedarProductionSuite input,#chedarProductionSuite select,#chedarProductionSuite textarea{width:100%;min-width:0;background:#090f1a;border:1px solid #40516a;border-radius:9px;padding:10px;color:#f3f4f6;font:13px/1.45 system-ui}
    #chedarProductionSuite textarea{min-height:76px;resize:vertical}
    #chedarProductionSuite .suiteActions{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}
    #chedarProductionSuite .suiteActions button{flex:1 1 125px;min-height:39px;padding:8px 10px;font-size:10px}
    #chedarProductionSuite .suitePrimary{background:linear-gradient(135deg,#f0dba9,#c49a58);color:#182131}
    #chedarProductionSuite .suiteSecondary{background:#1d2c41;border:1px solid #455a74;color:#e5edf7}
    #chedarProductionSuite .suiteOutput{margin-top:11px;border:1px solid #394d65;border-radius:10px;background:#0a1422;padding:10px}
    #chedarProductionSuite .suiteOutput label{display:block;color:#d9bd82;font-size:10px;font-weight:850;margin-bottom:6px}
    #chedarProductionSuite .suiteOutput pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;color:#dbe6f2;font:11px/1.6 ui-monospace,Consolas,monospace;max-height:360px;overflow:auto}
    #chedarProductionSuite .suiteStatus{min-height:18px;margin-top:8px;font-size:10px;color:#aebdce}
    #chedarProductionSuite .suiteStatus.ok{color:#69d6a8}
    #chedarProductionSuite .suiteStatus.err{color:#ff9999}
    #chedarProductionSuite .suiteNote{color:#95a6ba;font-size:10px;line-height:1.5;margin:8px 0}
    #chedarProductionSuite .suiteCheckList{display:grid;gap:6px;margin:8px 0}
    #chedarProductionSuite .suiteCheck{display:flex;gap:8px;align-items:flex-start;background:#101c2b;border:1px solid #33465d;border-radius:8px;padding:8px;color:#cbd5e1;font-size:10px}
    #chedarProductionSuite .suiteCheck input{width:auto;margin-top:1px;accent-color:#d9b878}
    @media(max-width:560px){#chedarProductionSuite .suiteGrid{grid-template-columns:1fr}#chedarProductionSuite .suiteField.full{grid-column:auto}#chedarProductionSuite .suiteBody{padding:7px 10px 12px}#chedarProductionSuite .suiteHead{padding:13px 11px}}
  `;
  document.head.appendChild(style);

  const section = document.createElement("section");
  section.id = "chedarProductionSuite";
  section.innerHTML = `
    <div class="suiteHead"><strong>✦ CHEDAR PRODUCTION DIRECTOR · 5 FITUR PRO</strong><p>Lima alat produksi terintegrasi. Jalankan otomatis setelah membuat paket video, atau jalankan ulang pada proyek aktif. Hasil AI siap disalin ke Google Flow atau Suno.</p><button type="button" class="suiteToggle" id="suiteMenuToggle" aria-expanded="false">⚙️ BUKA 5 FITUR OTOMATIS <span style="float:right">＋</span></button></div>
    <div class="suiteTabs" id="suiteTabs" role="tablist">
      <button type="button" class="suiteTab active" data-suite-tab="character">01 Character</button>
      <button type="button" class="suiteTab" data-suite-tab="storyboard">02 Storyboard</button>
      <button type="button" class="suiteTab" data-suite-tab="continuity">03 Continuity</button>
      <button type="button" class="suiteTab" data-suite-tab="voice">04 Voice</button>
      <button type="button" class="suiteTab" data-suite-tab="music">05 Music</button>
      <button type="button" class="suitePrimary" id="suiteRunAll">✦ JALANKAN 5 FITUR OTOMATIS</button>
    </div>
    <div class="suiteBody">
      <section class="suitePane" data-suite-pane="character">
        <h4>CHARACTER STUDIO · Character Bible & Identity Lock</h4>
        <div class="suiteGrid">
          <div class="suiteField"><label>NAMA KARAKTER</label><input id="csName" placeholder="Contoh: Agus / Ranie"></div>
          <div class="suiteField"><label>PERAN DALAM CERITA</label><input id="csRole" placeholder="Tokoh utama, pemandu, antagonis..."></div>
          <div class="suiteField full"><label>CIRI FISIK / IDENTITAS VISUAL</label><textarea id="csAppearance" placeholder="Deskripsikan ciri yang terlihat pada foto referensi. Jangan menebak detail yang tidak terlihat."></textarea></div>
          <div class="suiteField"><label>PAKAIAN & AKSESORI</label><textarea id="csWardrobe" placeholder="Pakaian, warna, aksesori..."></textarea></div>
          <div class="suiteField"><label>PROPERTI / KENDARAAN</label><textarea id="csProps" placeholder="Objek yang harus tetap sama..."></textarea></div>
          <div class="suiteField"><label>GAYA EKSPRESI</label><select id="csExpression"><option>Natural dan realistis</option><option>Hangat dan ramah</option><option>Tegas dan berwibawa</option><option>Ceria dan ekspresif</option><option>Dramatis dan emosional</option><option>Misterius dan tenang</option></select></div>
          <div class="suiteField"><label>FORMAT CHARACTER SHEET</label><select id="csSheet"><option>Front, back, left, right + ekspresi</option><option>Turnaround 360 derajat</option><option>Close-up wajah + 8 ekspresi</option><option>Full body + pose aksi</option><option>Character reference 9:16</option></select></div>
        </div>
        <p class="suiteNote">Pilih foto karakter di bagian FOTO REFERENSI pada form utama. Prompt akan mengingatkan Google Flow agar memakai foto yang sama sebagai master reference; aplikasi tidak mengunci wajah secara teknis di Flow.</p>
        <div class="suiteActions"><button class="suitePrimary" data-suite-run="character">✦ Buat Character Bible AI</button><button class="suiteSecondary" data-suite-local="character">Buat kunci lokal</button></div>
        <div class="suiteOutput"><label>CHARACTER BIBLE & PROMPT SIAP FLOW</label><pre id="csOutput">Character Bible akan muncul di sini.</pre><div class="suiteActions"><button class="suiteSecondary" data-suite-copy="csOutput">Salin Character Bible</button><button class="suiteSecondary" data-suite-apply="character">Terapkan ke kunci karakter utama</button></div></div>
      </section>

      <section class="suitePane" data-suite-pane="storyboard">
        <h4>VISUAL STORYBOARD · Shot Plan & Panel Prompt</h4>
        <div class="suiteGrid">
          <div class="suiteField"><label>JUMLAH PANEL</label><select id="sbCount"><option>6</option><option>9</option><option>12</option></select></div>
          <div class="suiteField"><label>GAYA STORYBOARD</label><select id="sbStyle"><option>Film storyboard sinematik profesional</option><option>Photorealistic cinematic frames</option><option>Animatic sketch hitam putih</option><option>Storyboard komersial / iklan</option></select></div>
          <div class="suiteField full"><label>ARAHAN TAMBAHAN / URUTAN ADEGAN</label><textarea id="sbNotes" placeholder="Opsional: tentukan opening, momen penting, klimaks, dan ending."></textarea></div>
        </div>
        <div class="suiteActions"><button class="suitePrimary" data-suite-run="storyboard">✦ Susun Storyboard AI</button><button class="suiteSecondary" data-suite-local="storyboard">Ambil dari proyek aktif</button></div>
        <p class="suiteNote">Jika proyek aktif sudah memiliki adegan, alat ini mengubah adegan tersebut menjadi panel storyboard dengan shot, komposisi, gerakan kamera, dan prompt gambar per panel.</p>
        <div class="suiteOutput"><label>STORYBOARD / PROMPT PANEL</label><pre id="sbOutput">Pilih Susun Storyboard AI atau ambil dari proyek aktif.</pre><div class="suiteActions"><button class="suiteSecondary" data-suite-copy="sbOutput">Salin semua panel</button></div></div>
      </section>

      <section class="suitePane" data-suite-pane="continuity">
        <h4>CONTINUITY CHECKER · Pemeriksaan Antaradegan</h4>
        <div class="suiteCheckList">
          <label class="suiteCheck"><input type="checkbox" id="ccFace" checked> Wajah, rambut, usia visual, dan identitas karakter harus sama.</label>
          <label class="suiteCheck"><input type="checkbox" id="ccWardrobe" checked> Pakaian, aksesori, kendaraan, dan properti harus konsisten.</label>
          <label class="suiteCheck"><input type="checkbox" id="ccLocation" checked> Lokasi, waktu, cuaca, dan arah cahaya harus menyambung.</label>
          <label class="suiteCheck"><input type="checkbox" id="ccScreen" checked> Posisi tokoh, arah gerak, eyeline, dan screen direction harus logis.</label>
          <label class="suiteCheck"><input type="checkbox" id="ccAudio" checked> Suara, narasi, dialog, musik, dan ambience harus konsisten.</label>
          <label class="suiteCheck"><input type="checkbox" id="ccTiming" checked> Durasi klip, urutan adegan, dan timecode harus benar.</label>
        </div>
        <div class="suiteField full"><label>CATATAN KHUSUS PEMERIKSAAN</label><textarea id="ccNotes" placeholder="Contoh: mobil harus tetap Ertiga putih; adegan berlangsung pada malam hari."></textarea></div>
        <div class="suiteActions"><button class="suitePrimary" data-suite-run="continuity">✦ Audit Continuity dengan AI</button><button class="suiteSecondary" data-suite-local="continuity">Audit struktur lokal</button></div>
        <div class="suiteOutput"><label>LAPORAN CONTINUITY & DAFTAR PERBAIKAN</label><pre id="ccOutput">Laporan pemeriksaan akan muncul di sini.</pre><div class="suiteActions"><button class="suiteSecondary" data-suite-copy="ccOutput">Salin laporan</button></div></div>
      </section>

      <section class="suitePane" data-suite-pane="voice">
        <h4>VOICE DIRECTOR · Voice Bible & Audio Performance</h4>
        <div class="suiteGrid">
          <div class="suiteField"><label>JENIS SUARA</label><select id="vdType"><option>Pria dewasa</option><option>Wanita dewasa</option><option>Suara anak kecil</option><option>Suara sesuai karakter referensi</option><option>Tanpa narator</option></select></div>
          <div class="suiteField"><label>WARNA / KARAKTER SUARA</label><select id="vdTone"><option>Berat, tenang, berwibawa</option><option>Natural, hangat, bersahaja</option><option>Ceria, energik, ekspresif</option><option>Lembut, emosional, menyentuh</option><option>Tegas, dramatis, intens</option><option>Misterius, rendah, menegangkan</option></select></div>
          <div class="suiteField"><label>BAHASA / AKSEN</label><select id="vdLanguage"><option>Bahasa Indonesia natural</option><option>Bahasa Bali sehari-hari</option><option>Bahasa Bali halus</option><option>Bahasa Inggris natural</option><option>Campuran sesuai cerita</option></select></div>
          <div class="suiteField"><label>TEMPO & ARTIKULASI</label><select id="vdPace"><option>Sedang, jelas, artikulasi kuat</option><option>Pelan, penuh jeda emosional</option><option>Cepat, energik, ekspresif</option><option>Ritmis, seperti trailer film</option><option>Natural seperti percakapan</option></select></div>
          <div class="suiteField"><label>EMOSI UTAMA</label><select id="vdEmotion"><option>Tenang dan percaya diri</option><option>Inspiratif dan menyentuh</option><option>Bahagia dan penuh semangat</option><option>Sedih dan reflektif</option><option>Tegang dan misterius</option><option>Humoris dan santai</option></select></div>
          <div class="suiteField"><label>POSISI SUARA</label><select id="vdPosition"><option>Voice-over di luar adegan</option><option>Dialog langsung karakter di layar</option><option>Narasi + dialog terpisah</option><option>Tanpa suara manusia</option></select></div>
          <div class="suiteField full"><label>TEKS NARASI / DIALOG WAJIB (OPSIONAL)</label><textarea id="vdText" placeholder="Tempel kalimat yang wajib dipertahankan persis."></textarea></div>
        </div>
        <div class="suiteActions"><button class="suitePrimary" data-suite-run="voice">✦ Buat Voice Direction AI</button><button class="suiteSecondary" data-suite-local="voice">Buat voice lock lokal</button></div>
        <div class="suiteOutput"><label>VOICE BIBLE & ARAHAN AUDIO PER ADEGAN</label><pre id="vdOutput">Arahan suara akan muncul di sini.</pre><div class="suiteActions"><button class="suiteSecondary" data-suite-copy="vdOutput">Salin voice direction</button></div></div>
      </section>

      <section class="suitePane" data-suite-pane="music">
        <h4>MUSIC DIRECTOR · Score, Sound Design & Suno Brief</h4>
        <div class="suiteGrid">
          <div class="suiteField"><label>GENRE MUSIK</label><select id="mdGenre"><option>Cinematic orchestral</option><option>Pop Bali modern</option><option>Dangdut koplo</option><option>Pop inspirational</option><option>Ambient atmospheric</option><option>Electronic cinematic</option><option>Acoustic emotional</option><option>Traditional ethnic fusion</option><option>Comedy upbeat</option><option>Instrumental only</option></select></div>
          <div class="suiteField"><label>SUASANA MUSIK</label><select id="mdMood"><option>Inspiratif dan membangkitkan semangat</option><option>Megah dan epik</option><option>Hangat dan menyentuh</option><option>Tegang dan misterius</option><option>Ceria dan menghibur</option><option>Romantis dan lembut</option><option>Heroik dan penuh energi</option></select></div>
          <div class="suiteField"><label>TEMPO</label><select id="mdTempo"><option>Medium build</option><option>Slow cinematic</option><option>Upbeat dance</option><option>Fast energetic</option><option>Variable cinematic score</option></select></div>
          <div class="suiteField"><label>VOKAL</label><select id="mdVocal"><option>Pria dewasa</option><option>Wanita dewasa</option><option>Duet pria dan wanita</option><option>Instrumental tanpa vokal</option><option>Choir / paduan suara</option></select></div>
          <div class="suiteField full"><label>INSTRUMEN / REFERENSI SUASANA</label><textarea id="mdInstruments" placeholder="Contoh: kendang Bali, gangsa, bass, gitar akustik, string orchestra..."></textarea></div>
        </div>
        <div class="suiteActions"><button class="suitePrimary" data-suite-run="music">✦ Buat Music Direction AI</button><button class="suiteSecondary" data-suite-local="music">Buat Suno brief lokal</button></div>
        <div class="suiteOutput"><label>MUSIC CUE SHEET, SOUND DESIGN & SUNO STYLE PROMPT</label><pre id="mdOutput">Music direction akan muncul di sini.</pre><div class="suiteActions"><button class="suiteSecondary" data-suite-copy="mdOutput">Salin music direction</button><button class="suiteSecondary" id="mdSendSuno">Pindahkan style prompt ke Suno Studio</button></div></div>
      </section>
      <div class="suiteStatus" id="suiteStatus" role="status">Semua alat siap digunakan.</div>
    </div>`;
  const quickGenerate = document.getElementById("quickGenerate");
  if (quickGenerate?.parentElement) quickGenerate.insertAdjacentElement("afterend", section);
  else host.appendChild(section);

  const $ = id => document.getElementById(id);
  let activeTool = "";
  const menuToggle = $("suiteMenuToggle");
  const suiteTabs = $("suiteTabs");
  menuToggle.addEventListener("click",()=>{
    const open=!suiteTabs.classList.contains("open");
    suiteTabs.classList.toggle("open",open);
    menuToggle.setAttribute("aria-expanded",String(open));
    menuToggle.innerHTML=(open?"⚙️ TUTUP MENU 5 FITUR":"⚙️ BUKA 5 FITUR OTOMATIS")+" <span style=\"float:right\">"+(open?"−":"＋")+"</span>";
  });
  const setStatus = (msg, type = "") => { $("suiteStatus").textContent = msg; $("suiteStatus").className = "suiteStatus " + type; };
  const activeProject = () => typeof project !== "undefined" && project?.scenes?.length ? project : null;
  const baseBrief = () => {
    const p = activeProject();
    const idea = $("quickIdea")?.value?.trim() || $("idea")?.value?.trim() || "";
    return { title: $("title")?.value || "Proyek video", idea, project: p ? {
      title:p.title, synopsis:p.synopsis, globalCharacterLock:p.globalCharacterLock,
      scenes:p.scenes.map(s=>({number:s.number,timecode:s.timecode,durationSeconds:s.durationSeconds,purpose:s.purpose,visual:s.visual,action:s.action,dialogue:s.dialogue,narration:s.narration,camera:s.camera,lighting:s.lighting,sound:s.sound,transition:s.transition,imagePrompt:s.imagePrompt,videoPrompt:s.videoPrompt}))
    } : null };
  };
  const safeText = value => String(value || "").trim();
  const normalizeOutput = value => String(value ?? "").replace(/\\r\\n|\\n|\\r/g,"\n");
  const localCharacter = () => {
    const data = {name:safeText($("csName").value)||"Karakter Utama",role:safeText($("csRole").value)||"Tokoh utama",appearance:safeText($("csAppearance").value)||"Ikuti foto referensi utama yang dilampirkan pengguna.",wardrobe:safeText($("csWardrobe").value)||"Tetapkan pakaian dari foto referensi dan pertahankan sama.",props:safeText($("csProps").value)||"Pertahankan properti utama yang terlihat.",expression:$("csExpression").value,sheet:$("csSheet").value};
    return [
      "CHEDAR AI KREATOR — CHARACTER BIBLE",
      "NAMA: "+data.name,"PERAN: "+data.role,"IDENTITAS VISUAL: "+data.appearance,
      "PAKAIAN & AKSESORI: "+data.wardrobe,"PROPERTI: "+data.props,"EKSPRESI: "+data.expression,
      "CHARACTER SHEET: "+data.sheet,
      "MASTER REFERENCE: Lampirkan foto karakter yang sama sebagai master reference di setiap generasi Google Flow. Pertahankan struktur wajah, jarak mata, alis, hidung, bibir, rahang, warna kulit, garis rambut, usia visual, proporsi tubuh, pakaian, aksesori dan ciri khas. Jangan menebak ciri yang tidak terlihat.",
      "TURNAROUND PROMPT: Buat character reference sheet profesional dengan tampak depan, belakang, samping kiri, samping kanan, full body, dan close-up wajah. Semua sudut menampilkan satu identitas yang sama, skala dan proporsi konsisten, latar studio netral, pencahayaan merata, tanpa teks acak, tanpa watermark.",
      "EXPRESSION PROMPT: Buat lembar ekspresi karakter yang sama: netral, senang, sedih, marah, terkejut, tertawa, takut, berpikir. Jangan mengubah identitas wajah atau gaya rambut.",
      "NEGATIVE LOCK: no identity drift, no face morphing, no age change, no hairstyle change, no wardrobe change, no duplicate character, no distorted anatomy, no extra fingers."
    ].join("\n\n");
  };
  const localStoryboard = () => {
    const p = activeProject();
    if (!p) return "Belum ada proyek aktif. Buat paket video terlebih dahulu, lalu pilih Ambil dari proyek aktif.";
    const count = Math.min(Number($("sbCount").value)||6,p.scenes.length);
    return ["CHEDAR AI KREATOR — VISUAL STORYBOARD", "JUDUL: "+p.title, "GAYA: "+$("sbStyle").value, "ARAHAN: "+safeText($("sbNotes").value), ...p.scenes.slice(0,count).map(s=>[
      "PANEL "+s.number+" | "+s.timecode+" | "+s.durationSeconds+" detik",
      "TUJUAN: "+(s.purpose||""),"VISUAL: "+(s.visual||""),"AKSI/BLOCKING: "+(s.action||""),
      "SHOT/KAMERA: "+(s.camera||""),"LIGHTING: "+(s.lighting||""),"TRANSISI: "+(s.transition||""),
      "IMAGE PROMPT: "+(s.imagePrompt||"")
    ].join("\n"))].join("\n\n------------------------------\n\n");
  };
  const localContinuity = () => {
    const p=activeProject(); if(!p) return "Belum ada proyek aktif. Buat paket video terlebih dahulu.";
    const rules=[["ccFace","Identitas wajah dan rambut"],["ccWardrobe","Pakaian, aksesori, kendaraan, properti"],["ccLocation","Lokasi, waktu, cuaca, pencahayaan"],["ccScreen","Blocking, screen direction, eyeline"],["ccAudio","Narasi, dialog, suara, musik"],["ccTiming","Durasi, nomor adegan, timecode"]];
    const checks=[];
    const scenes=p.scenes||[];
    const durations=scenes.map(s=>Number(s.durationSeconds)||0);
    const allDurations=durations.every(x=>x===durations[0]);
    const numbered=scenes.every((s,i)=>Number(s.number)===i+1);
    const prompts=scenes.every(s=>safeText(s.imagePrompt)&&safeText(s.videoPrompt));
    const faceLock=safeText(p.globalCharacterLock).length>20;
    const voiceSet=scenes.every(s=>safeText(s.narration)||safeText(s.dialogue)||/tanpa suara|no voice|instrumental/i.test(s.videoPrompt||""));
    checks.push("Jumlah adegan: "+scenes.length);
    checks.push("Nomor adegan berurutan: "+(numbered?"LULUS":"PERLU PERBAIKAN"));
    checks.push("Durasi tiap klip seragam: "+(allDurations?"LULUS ("+durations[0]+" detik)":"PERLU PERIKSA"));
    checks.push("Prompt gambar dan video tersedia: "+(prompts?"LULUS":"PERLU PERBAIKAN"));
    checks.push("Character lock global tersedia: "+(faceLock?"LULUS":"PERLU TAMBAHKAN"));
    checks.push("Track audio/narasi/dialog tercatat: "+(voiceSet?"TERCATAT":"PERLU PERIKSA"));
    checks.push("Kriteria audit yang dipilih: "+rules.filter(([id])=>$(id).checked).map(([,label])=>label).join(", "));
    checks.push("Catatan pengguna: "+(safeText($("ccNotes").value)||"Tidak ada"));
    checks.push("Pemeriksaan ini adalah audit struktur dan kelengkapan prompt; bukan verifikasi visual otomatis atas hasil render Flow.");
    return ["LAPORAN CONTINUITY CHECKER — "+p.title,...checks].join("\n");
  };
  const localVoice = () => {
    const p=activeProject();
    const scenes=p?.scenes||[];
    return [
      "CHEDAR AI KREATOR — VOICE BIBLE",
      "JENIS SUARA: "+$("vdType").value,
      "KARAKTER SUARA: "+$("vdTone").value,
      "BAHASA/AKSEN: "+$("vdLanguage").value,
      "TEMPO: "+$("vdPace").value,
      "EMOSI: "+$("vdEmotion").value,
      "POSISI: "+$("vdPosition").value,
      "TEKS WAJIB: "+(safeText($("vdText").value)||"Ikuti naskah/narasi dari proyek aktif; jangan mengarang kalimat tambahan."),
      "ATURAN KONSISTENSI: Gunakan satu voice identity yang sama dari awal hingga akhir. Pertahankan pitch, timbre, aksen, jarak mikrofon, artikulasi, volume, dan karakter emosi. Jangan mengubah gender atau karakter suara antaradegan.",
      "PEMISAHAN TRACK: Voice-over adalah narasi off-screen dan tidak memerlukan lip-sync. Dialog adalah ucapan karakter di layar dan hanya pembicara yang ditandai boleh lip-sync. Jangan mencampur narasi dengan dialog.",
      ...scenes.map(s=>"ADEGAN "+s.number+" ("+s.timecode+"): "+(s.narration?"NARASI: "+s.narration:"")+(s.dialogue?" | DIALOG: "+s.dialogue:""))
    ].join("\n\n");
  };
  const localMusic = () => {
    const p=activeProject();
    const cues=(p?.scenes||[]).map(s=>"ADEGAN "+s.number+" ("+s.timecode+"): "+(s.purpose||s.visual||"")+". MUSIK: sesuaikan intensitas dengan beat emosi adegan. SFX: ambience lokasi yang natural; hindari menutupi dialog.");
    return [
      "CHEDAR AI KREATOR — MUSIC DIRECTOR",
      "GENRE: "+$("mdGenre").value,"MOOD: "+$("mdMood").value,"TEMPO: "+$("mdTempo").value,"VOKAL: "+$("mdVocal").value,
      "INSTRUMEN: "+(safeText($("mdInstruments").value)||"Pilih instrumen yang mendukung genre tanpa memenuhi ruang dialog."),
      "SUNO STYLE PROMPT: "+$("mdGenre").value+", "+$("mdMood").value+", "+$("mdTempo").value+", "+$("mdVocal").value+", professional studio production, dynamic arrangement, clean mix, emotional build, no imitation of existing artists or songs.",
      "MUSIC ARC: opening hook → build → emotional lift / tension → climax → resolved ending.",
      "MIX: musik turun otomatis saat narasi/dialog; SFX dan ambience tetap natural; hindari clipping dan frekuensi yang menutupi vokal.",
      ...cues
    ].join("\n\n");
  };
  const payloadFor = tool => {
    const base=baseBrief();
    const common={...base,tool};
    if(tool==="character")return {...common,character:{name:$("csName").value,role:$("csRole").value,appearance:$("csAppearance").value,wardrobe:$("csWardrobe").value,props:$("csProps").value,expression:$("csExpression").value,sheet:$("csSheet").value}};
    if(tool==="storyboard")return {...common,count:$("sbCount").value,style:$("sbStyle").value,notes:$("sbNotes").value};
    if(tool==="continuity")return {...common,checks:["ccFace","ccWardrobe","ccLocation","ccScreen","ccAudio","ccTiming"].filter(id=>$(id).checked),notes:$("ccNotes").value};
    if(tool==="voice")return {...common,voice:{type:$("vdType").value,tone:$("vdTone").value,language:$("vdLanguage").value,pace:$("vdPace").value,emotion:$("vdEmotion").value,position:$("vdPosition").value,text:$("vdText").value}};
    return {...common,music:{genre:$("mdGenre").value,mood:$("mdMood").value,tempo:$("mdTempo").value,vocal:$("mdVocal").value,instruments:$("mdInstruments").value}};
  };
  const outputId={character:"csOutput",storyboard:"sbOutput",continuity:"ccOutput",voice:"vdOutput",music:"mdOutput"};
  const localFns={character:localCharacter,storyboard:localStoryboard,continuity:localContinuity,voice:localVoice,music:localMusic};
  const runAI=async tool=>{
    const output=$(outputId[tool]);const brief=payloadFor(tool);
    if(!brief.idea&&!brief.project){setStatus("Isi ide video atau buat proyek terlebih dahulu.","err");return;}
    const btn=document.querySelector('[data-suite-run="'+tool+'"]');if(btn){btn.disabled=true;btn.textContent="AI sedang bekerja...";}
    setStatus("AI sedang menyusun "+tool+"...");
    try{
      const response=await fetch("/api/production-tools",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...brief,aiEngine:((localStorage.getItem("chedar_ai_engine_v2")||"gemini"))})});
      const result=await response.json();if(!response.ok)throw new Error(result.error||"AI gagal menyusun arahan.");
      output.textContent=normalizeOutput(result.result||"AI tidak mengembalikan hasil.");
      setStatus("Selesai. Periksa hasil sebelum dipakai di Flow.","ok");
    }catch(error){setStatus(error.message||"Tidak dapat menghubungi AI.","err");}
    finally{if(btn){btn.disabled=false;btn.textContent=({character:"✦ Buat Character Bible AI",storyboard:"✦ Susun Storyboard AI",continuity:"✦ Audit Continuity dengan AI",voice:"✦ Buat Voice Direction AI",music:"✦ Buat Music Direction AI"})[tool];}}
  };
  section.querySelectorAll("[data-suite-tab]").forEach(btn=>btn.addEventListener("click",()=>{
    activeTool=btn.dataset.suiteTab;
    section.querySelectorAll("[data-suite-tab]").forEach(x=>x.classList.toggle("active",x===btn));
    section.querySelectorAll("[data-suite-pane]").forEach(x=>x.classList.toggle("active",x.dataset.suitePane===activeTool));
    suiteTabs.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.innerHTML="⚙️ BUKA 5 FITUR OTOMATIS <span style=\"float:right\">＋</span>";
  }));
  section.querySelectorAll("[data-suite-run]").forEach(btn=>btn.addEventListener("click",()=>runAI(btn.dataset.suiteRun)));
  section.querySelectorAll("[data-suite-local]").forEach(btn=>btn.addEventListener("click",()=>{
    const tool=btn.dataset.suiteLocal;$(outputId[tool]).textContent=normalizeOutput(localFns[tool]());setStatus("Arahan lokal berhasil disusun. Ini template terstruktur, bukan hasil analisis AI.","ok");
  }));
  section.querySelectorAll("[data-suite-copy]").forEach(btn=>btn.addEventListener("click",async()=>{
    const value=$(btn.dataset.suiteCopy).textContent.trim();if(!value)return;
    try{await navigator.clipboard.writeText(value);setStatus("Hasil berhasil disalin.","ok");}
    catch{setStatus("Clipboard tidak tersedia. Pilih teks output lalu salin manual.","err");}
  }));
  section.querySelector('[data-suite-apply="character"]').addEventListener("click",()=>{
    const value=$("csOutput").textContent.trim();if(!value||value.includes("akan muncul"))return setStatus("Buat Character Bible terlebih dahulu.","err");
    const lock="CHARACTER BIBLE / IDENTITY LOCK:\n"+value;
    if($("character"))$("character").value=[ $("character").value.trim(),lock].filter(Boolean).join("\n\n");
    if($("faceLock"))$("faceLock").value=[ $("faceLock").value.trim(),value].filter(Boolean).join("\n\n");
    if($("wardrobeLock"))$("wardrobeLock").value=[ $("wardrobeLock").value.trim(),safeText($("csWardrobe").value)].filter(Boolean).join("\n\n");
    if($("continuity"))$("continuity").value=[ $("continuity").value.trim(),"Terapkan Character Bible yang sama pada setiap adegan."].filter(Boolean).join("\n\n");
    setStatus("Character Bible diterapkan ke pengaturan karakter utama.","ok");
  });
  $("mdSendSuno").addEventListener("click",()=>{
    const value=$("mdOutput").textContent.trim();if(!value||value.includes("akan muncul"))return setStatus("Buat Music Direction terlebih dahulu.","err");
    const match=value.match(/SUNO STYLE PROMPT:\s*([^\n]+)/i);
    const prompt=match?match[1]:value;
    if($("musicPrompt"))$("musicPrompt").value=prompt;
    const existing=$("musicLyrics");
    if(existing&&!existing.value.trim())existing.value="";
    setStatus("Style prompt dipindahkan ke Suno Music Studio. Buka bagian Music Studio untuk melanjutkan.","ok");
    $("musicPrompt")?.scrollIntoView({behavior:"smooth",block:"center"});
  });
  const runAll=async()=>{
    const p=activeProject();
    if(!p){setStatus("Buat paket video utama terlebih dahulu, lalu jalankan lima fitur otomatis.","err");return false;}
    const button=$("suiteRunAll");
    if(button){button.disabled=true;button.textContent="AI MENJALANKAN 5 FITUR...";}
    setStatus("Menjalankan Character, Storyboard, Continuity, Voice, dan Music Director dalam satu proses...");
    const settings={
      videoType:$("videoType")?.value,style:$("style")?.value,ratio:$("ratio")?.value,
      duration:$("duration")?.value,language:$("language")?.value,voice:$("voice")?.value,
      character:$("character")?.value,faceLock:$("faceLock")?.value,wardrobeLock:$("wardrobeLock")?.value,
      wardrobe:$("wardrobe")?.value,location:$("location")?.value,continuity:$("continuity")?.value,
      camera:$("camera")?.value,lighting:$("lighting")?.value,dialogue:$("dialogue")?.value,
      audio:$("audio")?.value,audioMode:$("audioMode")?.value,narratorVoice:$("narratorVoice")?.value,
      musicGenre:$("musicGenre")?.value,musicMood:$("musicMood")?.value,musicVocal:$("musicVocal")?.value,
      musicLanguage:$("musicLanguage")?.value,musicLyrics:$("musicLyrics")?.value,musicPrompt:$("musicPrompt")?.value
    };
    const brief=baseBrief();
    const payload={
      tool:"auto",title:p.title||"Proyek video",
      idea:$("quickIdea")?.value?.trim()||$("idea")?.value?.trim()||p.synopsis||"",
      project:brief.project,
      settings,
      auto:{
        character:{name:$("csName").value,role:$("csRole").value,appearance:$("csAppearance").value,wardrobe:$("csWardrobe").value,props:$("csProps").value},
        storyboard:{count:p.scenes.length,style:$("sbStyle").value,notes:$("sbNotes").value},
        continuity:{checks:["ccFace","ccWardrobe","ccLocation","ccScreen","ccAudio","ccTiming"].filter(id=>$(id).checked),notes:$("ccNotes").value},
        voice:{type:$("vdType").value,tone:$("vdTone").value,language:$("vdLanguage").value,pace:$("vdPace").value,emotion:$("vdEmotion").value,position:$("vdPosition").value,text:$("vdText").value},
        music:{genre:$("mdGenre").value,mood:$("mdMood").value,tempo:$("mdTempo").value,vocal:$("mdVocal").value,instruments:$("mdInstruments").value}
      }
    };
    try{
      const response=await fetch("/api/production-tools",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...payload,aiEngine:((localStorage.getItem("chedar_ai_engine_v2")||"gemini"))})});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||"Lima fitur otomatis gagal dijalankan.");
      const outputs=result.results||{};
      const required=["character","storyboard","continuity","voice","music"];
      if(required.some(key=>typeof outputs[key]!=="string"||!outputs[key].trim()))throw new Error("Hasil otomatis belum lengkap. Silakan coba sekali lagi.");
      $("csOutput").textContent=normalizeOutput(outputs.character);
      $("sbOutput").textContent=normalizeOutput(outputs.storyboard);
      $("ccOutput").textContent=normalizeOutput(outputs.continuity);
      $("vdOutput").textContent=normalizeOutput(outputs.voice);
      $("mdOutput").textContent=normalizeOutput(outputs.music);
      p.productionSuite=Object.fromEntries(required.map(key=>[key,normalizeOutput(outputs[key])]));
      const clip=(value,max)=>String(value||"").trim().slice(0,max);
      const addOnce=(base,label,value)=>base.includes(label)?base:[base,label+"\n"+value].filter(Boolean).join("\n\n");
      const characterLock=clip(outputs.character,1100),voiceLock=clip(outputs.voice,650),musicLock=clip(outputs.music,650);
      p.globalCharacterLock=addOnce(p.globalCharacterLock,"AUTO CHARACTER BIBLE:",characterLock);
      p.scenes.forEach(scene=>{
        scene.imagePrompt=addOnce(scene.imagePrompt,"AUTO CHARACTER BIBLE:",characterLock);
        scene.videoPrompt=addOnce(scene.videoPrompt,"AUTO VOICE DIRECTION:",voiceLock);
        scene.videoPrompt=addOnce(scene.videoPrompt,"AUTO MUSIC & SOUND DIRECTION:",musicLock);
      });
      if(typeof render==="function")render();
      try{
        const saved=JSON.parse(localStorage.getItem("agusStudioProjects")||"[]");
        const item=saved.find(entry=>Number(entry.id)===Number(activeProjectId));
        const formData=typeof getData==="function"?getData():{};
        if(item){item.project=p;item.form=formData;item.savedAt=new Date().toLocaleString("id-ID");localStorage.setItem("agusStudioProjects",JSON.stringify(saved));}
        localStorage.setItem("agusStudioLastProject",JSON.stringify({id:activeProjectId,title:p.title,project:p,form:formData,savedAt:new Date().toLocaleString("id-ID")}));
        if(typeof renderSaved==="function")renderSaved();
      }catch(error){console.warn("Gagal menyimpan hasil lima fitur otomatis",error);}
      setStatus("Selesai! Kelima departemen AI sudah diterapkan ke paket produksi dan prompt tiap adegan.","ok");
      return true;
    }catch(error){
      setStatus(error.message||"Gagal menjalankan lima fitur otomatis.","err");
      return false;
    }finally{
      if(button){button.disabled=false;button.textContent="✦ JALANKAN 5 FITUR OTOMATIS";}
    }
  };
  $("suiteRunAll").addEventListener("click",runAll);
  window.ChedarProductionSuite={run:runAI,local:localFns,runAll};
})();
/* CHEDAR AI KREATOR — Lip Sync Studio, Motion Control Director, Flow Prompt Optimizer */
(() => {
  const host = document.getElementById("quickStudio");
  if (!host || document.getElementById("advancedPromptStudio")) return;
  const style = document.createElement("style");
  style.textContent = `
    #advancedPromptStudio{margin:14px 0;border:1px solid #b99a5a55;border-radius:15px;background:linear-gradient(145deg,#17263a,#101a29);overflow:hidden}
    #advancedPromptStudio summary{cursor:pointer;list-style:none;padding:14px 13px;color:#f0d9a6;font-weight:850;font-size:12px;letter-spacing:.06em;display:flex;align-items:center;justify-content:space-between;gap:8px}
    #advancedPromptStudio summary::-webkit-details-marker{display:none}
    #advancedPromptStudio summary:after{content:"＋";font-size:18px;color:#e8cf98}
    #advancedPromptStudio[open] summary:after{content:"−"}
    .advancedInner{padding:0 12px 13px;border-top:1px solid #b99a5a30}
    .advancedTabs{display:flex;gap:6px;overflow-x:auto;padding:12px 0 9px}
    .advancedTab{flex:1 0 auto;background:#111d2d;border:1px solid #40516a;color:#c8d5e6;border-radius:9px;padding:9px 10px;font-size:10px}
    .advancedTab.active{background:linear-gradient(135deg,#f0dba9,#c49a58);color:#17202c;border-color:#e6cc96}
    .advancedTool{display:none}.advancedTool.active{display:block}
    .advancedTool textarea{min-height:90px}
    .advancedOutput{min-height:130px!important;font:12px/1.55 ui-monospace,Consolas,monospace!important}
    .advancedHint{font-size:10px;color:#aebdce;line-height:1.5;margin:7px 0}
    .advancedStatus{font-size:11px;color:#69d6a8;min-height:18px;margin-top:7px}
    @media(max-width:600px){.advancedTab{font-size:9px;padding:9px 7px}.advancedInner{padding-left:10px;padding-right:10px}}
  `;
  document.head.appendChild(style);
  const details = document.createElement("details");
  details.id = "advancedPromptStudio";
  details.innerHTML = `
    <summary>FITUR STUDIO LANJUTAN · LIPSYNC · MOTION · OPTIMIZER</summary>
    <div class="advancedInner">
      <div class="advancedTabs" role="tablist">
        <button type="button" class="advancedTab active" data-advanced="lip">LIP SYNC STUDIO</button>
        <button type="button" class="advancedTab" data-advanced="motion">MOTION CONTROL</button>
        <button type="button" class="advancedTab" data-advanced="optimizer">FLOW OPTIMIZER</button>
      </div>
      <section class="advancedTool active" id="advancedLip">
        <h3>AI Lip Sync Studio</h3>
        <div class="field"><label for="advLipAudio">JENIS AUDIO</label><select id="advLipAudio"><option>Lagu / MP3</option><option>Dialog / rekaman suara</option><option>Voice over</option></select></div>
        <div class="field"><label for="advLipDuration">DURASI KLIP</label><select id="advLipDuration"><option>5–10 detik</option><option>10–15 detik</option><option>15–30 detik</option><option>Lebih dari 30 detik (pecah menjadi beberapa klip)</option></select></div>
        <div class="field"><label for="advLipText">LIRIK / DIALOG PERSIS</label><textarea id="advLipText" placeholder="Tempel lirik atau dialog yang harus diucapkan."></textarea></div>
        <div class="field"><label for="advLipMood">EKSPRESI DAN GAYA</label><input id="advLipMood" placeholder="Contoh: emosional, senyum hangat, pop Bali ceria"></div>
        <div class="actions"><button type="button" class="gold" id="advLipMake">BUAT PROMPT LIPSYNC</button><button type="button" class="secondary" data-copy-advanced="advLipOutput">SALIN PROMPT</button></div>
        <div class="field"><label for="advLipOutput">PROMPT SIAP FLOW</label><textarea id="advLipOutput" class="advancedOutput" readonly placeholder="Prompt lipsync akan muncul di sini."></textarea></div>
        <p class="advancedHint">Gunakan foto karakter sebagai referensi. Lampirkan MP3/audio secara terpisah pada fitur lipsync yang tersedia. Jika fitur tidak tersedia di akun atau mode Flow Anda, prompt ini tidak mengaktifkannya secara otomatis.</p>
      </section>
      <section class="advancedTool" id="advancedMotion">
        <h3>Motion Control Director</h3>
        <div class="field"><label for="advMotionSource">SUMBER GERAKAN</label><select id="advMotionSource"><option>Video referensi gerakan</option><option>Deskripsi gerakan teks</option><option>Koreografi / tarian</option><option>Aksi / gerakan karakter</option></select></div>
        <div class="field"><label for="advMotionAction">URUTAN GERAKAN</label><textarea id="advMotionAction" placeholder="Contoh: berjalan tiga langkah, berhenti, menoleh ke kamera, lalu mengangkat tangan kanan."></textarea></div>
        <div class="field"><label for="advMotionFrame">FRAMING KAMERA</label><select id="advMotionFrame"><option>Full body — seluruh tubuh terlihat</option><option>Medium shot — pinggang ke atas</option><option>Close-up — wajah dan bahu</option><option>Wide shot — karakter dan lingkungan</option></select></div>
        <div class="field"><label for="advMotionLock">KUNCI KARAKTER / ARAHAN TAMBAHAN</label><textarea id="advMotionLock" placeholder="Pertahankan wajah, pakaian, proporsi tubuh, dan lokasi."></textarea></div>
        <div class="actions"><button type="button" class="gold" id="advMotionMake">BUAT PROMPT GERAKAN</button><button type="button" class="secondary" data-copy-advanced="advMotionOutput">SALIN PROMPT</button></div>
        <div class="field"><label for="advMotionOutput">PROMPT SIAP FLOW</label><textarea id="advMotionOutput" class="advancedOutput" readonly placeholder="Prompt motion control akan muncul di sini."></textarea></div>
        <p class="advancedHint">Jika memakai video referensi, unggah video gerakan tersebut pada fitur Motion Control di alat yang mendukungnya. Prompt ini hanya memberi arahan gerakan.</p>
      </section>
      <section class="advancedTool" id="advancedOptimizer">
        <h3>Flow Prompt Optimizer</h3>
        <div class="field"><label for="advRawPrompt">PROMPT MENTAH / IDE ADEGAN</label><textarea id="advRawPrompt" placeholder="Tempel prompt sederhana atau tulis ide adegan di sini."></textarea></div>
        <div class="grid">
          <div class="field"><label for="advOptStyle">GAYA VISUAL</label><select id="advOptStyle"><option>Cinematic realistis</option><option>Dark cinematic</option><option>Dokumenter natural</option><option>Film epik</option><option>Iklan profesional</option><option>Futuristik</option></select></div>
          <div class="field"><label for="advOptRatio">FORMAT</label><select id="advOptRatio"><option>Vertikal 9:16</option><option>Horizontal 16:9</option><option>Persegi 1:1</option></select></div>
        </div>
        <div class="field"><label for="advOptLock">KONSISTENSI / BATASAN</label><textarea id="advOptLock" rows="2" placeholder="Contoh: wajah sama dengan foto referensi, pakaian tetap, tanpa teks acak."></textarea></div>
        <div class="actions"><button type="button" class="gold" id="advOptimize">OPTIMALKAN PROMPT</button><button type="button" class="secondary" data-copy-advanced="advOptOutput">SALIN PROMPT</button></div>
        <div class="field"><label for="advOptOutput">PROMPT FLOW TERSTRUKTUR</label><textarea id="advOptOutput" class="advancedOutput" readonly placeholder="Prompt yang sudah dioptimalkan akan muncul di sini."></textarea></div>
        <p class="advancedHint">Optimizer lokal menyusun ulang detail visual dan teknis tanpa mengubah ide inti. Periksa kembali hasilnya sebelum digunakan.</p>
      </section>
      <div class="advancedStatus" id="advancedStatus" role="status"></div>
    </div>`;
  const anchor = host.querySelector(".quickOptions");
  if (anchor) host.insertBefore(details, anchor);
  else host.appendChild(details);
  const $ = id => document.getElementById(id);
  const status = msg => { $("advancedStatus").textContent = msg; };
  details.querySelectorAll("[data-advanced]").forEach(btn => btn.addEventListener("click", () => {
    details.querySelectorAll("[data-advanced]").forEach(x => x.classList.toggle("active", x === btn));
    details.querySelectorAll(".advancedTool").forEach(x => x.classList.toggle("active", x.id === "advanced" + btn.dataset.advanced.charAt(0).toUpperCase() + btn.dataset.advanced.slice(1)));
    status("");
  }));
  $("advLipMake").addEventListener("click", () => {
    const lyric = $("advLipText").value.trim();
    if (!lyric) return status("Isi lirik atau dialog terlebih dahulu.");
    const mood = $("advLipMood").value.trim() || "ekspresi natural mengikuti emosi audio";
    $("advLipOutput").value = [
      "GOOGLE FLOW — LIP SYNC PERFORMANCE PROMPT",
      "Gunakan foto referensi sebagai identitas visual utama. Pertahankan wajah, usia visual, warna kulit, bentuk rambut, pakaian dan aksesori secara konsisten.",
      "Karakter menghadap kamera dengan framing close-up atau medium close-up, wajah dan mulut terlihat jelas, pencahayaan wajah merata, fokus tajam pada mata dan mulut.",
      "Audio sumber: " + $("advLipAudio").value + ". Durasi target: " + $("advLipDuration").value + ".",
      "Sinkronkan gerakan bibir secara presisi dengan audio yang dilampirkan terpisah. Jangan mengubah, menambah, mengurangi atau mengarang lirik/dialog berikut:",
      lyric,
      "Ekspresi: " + mood + ". Gerakan kepala dan kamera minimal, artikulasi mulut natural, kedipan dan micro-expression realistis. Jangan membuat karakter lain berbicara, jangan menambahkan suara atau lirik, hindari distorsi wajah, gigi dan mulut, identity drift, jitter, serta perubahan pakaian.",
      "Audio harus dipilih/diunggah terpisah pada fitur lipsync yang mendukung audio reference. Prompt ini tidak mengunggah atau memproses audio secara otomatis."
    ].join("\n\n");
    status("Prompt lipsync siap disalin.");
  });
  $("advMotionMake").addEventListener("click", () => {
    const action = $("advMotionAction").value.trim();
    if (!action) return status("Isi urutan gerakan terlebih dahulu.");
    $("advMotionOutput").value = [
      "GOOGLE FLOW — MOTION CONTROL DIRECTOR PROMPT",
      "Sumber gerakan: " + $("advMotionSource").value + ".",
      "Ikuti gerakan dengan urutan, timing, arah, pose, gestur dan ritme yang konsisten. Urutan gerakan: " + action,
      "Framing: " + $("advMotionFrame").value + ". Pastikan bagian tubuh yang diperlukan tetap berada di dalam frame.",
      "Kunci karakter: " + ($("advMotionLock").value.trim() || "gunakan foto referensi sebagai acuan identitas; pertahankan wajah, rambut, pakaian, proporsi tubuh dan aksesori di seluruh frame."),
      "Gerakan harus memiliki anatomi dan biomekanika natural, keseimbangan tubuh masuk akal, kontak kaki dengan lantai akurat, transisi pose halus, timing stabil dan arah gerak terbaca.",
      "Kamera stabil dan tidak memotong anggota tubuh yang sedang bergerak. Hindari perubahan identitas, wajah berubah, pakaian berubah, anggota tubuh tambahan, tangan cacat, jitter, foot sliding, gerakan patah dan objek yang berpindah tanpa sebab.",
      "Jika memakai video referensi, lampirkan video tersebut pada fitur Motion Control yang mendukungnya. Prompt ini hanya menyiapkan arahan, bukan mengekstrak gerakan dari video."
    ].join("\n\n");
    status("Prompt Motion Control siap disalin.");
  });
  $("advOptimize").addEventListener("click", () => {
    const raw = $("advRawPrompt").value.trim();
    if (!raw) return status("Tempel prompt atau tulis ide adegan terlebih dahulu.");
    $("advOptOutput").value = [
      "GOOGLE FLOW — OPTIMIZED CINEMATIC VIDEO PROMPT",
      "INTI ADEGAN: " + raw,
      "VISUAL STYLE: " + $("advOptStyle").value + ". FORMAT: " + $("advOptRatio").value + ".",
      "SUBJEK DAN AKSI: tampilkan subjek utama dengan identitas, tujuan, ekspresi dan gerakan yang jelas. Pertahankan anatomi, skala dan interaksi fisik yang realistis.",
      "KOMPOSISI DAN KAMERA: pilih ukuran shot dan angle yang paling mendukung adegan; gerakan kamera halus, stabil dan punya motivasi; fokus serta depth of field terarah; jaga screen direction dan geografi ruang.",
      "PENCAHAYAAN DAN LINGKUNGAN: pencahayaan sinematik yang masuk akal dengan sumber cahaya konsisten; detail lokasi mendukung cerita tanpa mengalihkan fokus.",
      "KONTINUITAS DAN BATASAN: " + ($("advOptLock").value.trim() || "jaga identitas karakter, pakaian, properti dan lokasi tetap konsisten; tanpa perubahan wajah, objek ganda, anggota tubuh tambahan atau teks acak."),
      "GERAKAN DAN KUALITAS: gerak tubuh natural, temporal consistency, realistic physics, stable composition, detailed textures, cinematic color grading.",
      "OUTPUT: satu adegan yang utuh dan mudah dipahami, tanpa montage acak, tanpa dialog atau karakter tambahan yang tidak diminta. Ikuti ide inti pengguna tanpa mengubah maknanya."
    ].join("\n\n");
    status("Prompt berhasil disusun. Periksa hasil lalu salin ke Google Flow.");
  });
  details.querySelectorAll("[data-copy-advanced]").forEach(btn => btn.addEventListener("click", async () => {
    const value = $(btn.dataset.copyAdvanced).value.trim();
    if (!value) return status("Buat prompt terlebih dahulu.");
    try { await navigator.clipboard.writeText(value); status("Prompt berhasil disalin."); }
    catch { $(btn.dataset.copyAdvanced).focus(); $(btn.dataset.copyAdvanced).select(); status("Pilih teks lalu salin secara manual."); }
  }));
})();
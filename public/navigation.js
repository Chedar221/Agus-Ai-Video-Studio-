/* AGUS AI STUDIO — navigation and unified button icons */
(() => {
  const allPanels = [...document.querySelectorAll(".layout > .stack > .panel")];
  // Try launching the installed Google Flow Android app via a package-scoped
  // launcher intent. If Android cannot resolve it, send the user to its Play Store listing.
  const flowUrl = "https://flow.google.com/";
  const flowPackage = "com.google.android.apps.labs.whisk";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=" + flowPackage;
  const launchFlow = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      const fallback = encodeURIComponent(playStoreUrl);
      const intentUrl =
        "intent:#Intent;package=" + flowPackage +
        ";action=android.intent.action.MAIN" +
        ";category=android.intent.category.LAUNCHER" +
        ";S.browser_fallback_url=" + fallback +
        ";end";
      window.location.href = intentUrl;
      return;
    }
    window.open(flowUrl, "_blank", "noopener,noreferrer");
  };

  // One monochrome, text-based icon per control. No colorful emoji duplicates.
  const iconFor = (el) => {
    const id = el.id || "";
    const key = (el.dataset.target || el.dataset.quicktab || el.dataset.tab || el.textContent || "").toLowerCase();
    if (id.toLowerCase().includes("flow") || key.includes("flow")) return "↗";
    if (id.includes("delete") || el.dataset.delete || key.includes("hapus")) return "×";
    if (id.includes("download") || key.includes("unduh")) return "↓";
    if (id.includes("copy") || el.dataset.copyScene || key.includes("salin")) return "▢";
    if (id.includes("save") || key.includes("simpan") || key.includes("disimpan")) return "▣";
    if (id.includes("reset") || key.includes("reset") || key.includes("pulihkan")) return "↻";
    if (id.includes("musicOpen") || key.includes("suno")) return "♫";
    if (id.includes("musicGenerate") || key.includes("lirik")) return "♪";
    if (id.includes("quickGenerate") || id.includes("aiBtn") || key.includes("generate") || key.includes("buat paket")) return "✦";
    if (id.includes("template") || key.includes("template")) return "▧";
    if (id.toLowerCase().includes("storyboard") || key.includes("storyboard")) return "▤";
    if (key.includes("quickidepanel") || key.includes("ide cerita")) return "◇";
    if (key.includes("quickreferencepanel") || key.includes("foto referensi")) return "▧";
    if (key.includes("quickdialoguepanel") || key.includes("dialog")) return "☰";
    if (key.includes("outputpanel") || key.includes("hasil video")) return "▶";
    if (key.includes("savedprojects") || key.includes("hasil disimpan")) return "▣";
    if (key.includes("prompt gambar")) return "▧";
    if (key.includes("prompt video")) return "▶";
    if (key.includes("check")) return "✓";
    if (key.includes("cerita")) return "▤";
    if (key.includes("buka")) return "↗";
    if (key.includes("prompt library")) return "▦";
    return "•";
  };

  const stripLeadingDecor = (el) => {
    // Remove leading emoji/decorative glyphs from the label; the icon is supplied separately.
    for (const node of [...el.childNodes]) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      const cleaned = node.textContent.replace(/^\s*(?:(?:[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]|[✦↗▣▶])\uFE0F?\s*)+/u, "");
      if (cleaned !== node.textContent) node.textContent = cleaned;
      if (node.textContent.trim()) break;
    }
  };

  const decorateButtons = (root = document) => {
    root.querySelectorAll("button, a.featureLink, #openGoogleFlowOutput").forEach((el) => {
      el.querySelectorAll(":scope > .btnIcon").forEach((old, index) => { if (index > 0) old.remove(); });
      let icon = el.querySelector(":scope > .btnIcon");
      if (!icon) {
        icon = document.createElement("span");
        icon.className = "btnIcon";
        icon.setAttribute("aria-hidden", "true");
        el.insertBefore(icon, el.firstChild);
      }
      const nextIcon = iconFor(el);
      if (icon.textContent !== nextIcon) icon.textContent = nextIcon;
      stripLeadingDecor(el);
    });
  };

  decorateButtons();
  const iconObserver = new MutationObserver((records) => {
    if (records.some(record => record.type === "childList" || record.type === "characterData")) decorateButtons();
  });
  iconObserver.observe(document.body, { childList: true, characterData: true, subtree: true });

  const navLinks = document.querySelector(".featureNavLinks");
  if (navLinks && !document.getElementById("openGoogleFlowNav")) {
    const flowLink = document.createElement("a");
    flowLink.id = "openGoogleFlowNav";
    flowLink.className = "featureLink";
    flowLink.href = flowUrl;
    flowLink.textContent = "BUKA FLOW";
    flowLink.setAttribute("aria-label", "Buka aplikasi Google Flow atau versi web");
    flowLink.addEventListener("click", event => { event.preventDefault(); launchFlow(); });
    navLinks.appendChild(flowLink);
  }
  const outputActions = document.querySelector("#outputPanel > .actions");
  if (outputActions && !document.getElementById("openGoogleFlowOutput")) {
    const flowButton = document.createElement("a");
    flowButton.id = "openGoogleFlowOutput";
    flowButton.href = flowUrl;
    flowButton.textContent = "BUKA FLOW";
    flowButton.setAttribute("aria-label", "Buka aplikasi Google Flow atau versi web");
    flowButton.addEventListener("click", event => { event.preventDefault(); launchFlow(); });
    Object.assign(flowButton.style, {
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      textDecoration: "none", font: "700 11px system-ui", borderRadius: "10px",
      padding: "8px 11px", background: "linear-gradient(135deg,#f0d9a6,#bd8d48)",
      color: "#1b2433", border: "1px solid #e8d4a5", whiteSpace: "normal"
    });
    outputActions.appendChild(flowButton);
  }

  function show(id, scroll=true) {
    const allowed = ["quickStudio","outputPanel","savedProjects"];
    const target = allowed.includes(id) ? id : "quickStudio";
    allPanels.forEach(panel => {
      const visible = panel.id === target;
      panel.classList.toggle("feature-visible", visible);
      panel.setAttribute("aria-hidden", visible ? "false" : "true");
    });
    document.querySelectorAll(".featureLink[data-target]").forEach(btn => {
      const active = btn.dataset.target === target;
      btn.classList.toggle("active",active);
      if(active) btn.setAttribute("aria-current","page");
      else btn.removeAttribute("aria-current");
    });
    if(scroll) window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  }
  document.querySelectorAll('.featureLink[data-target]').forEach(btn =>
    btn.addEventListener("click",()=>show(btn.dataset.target))
  );

  // AI Scene Editor: edit one scene without rebuilding the full project.
  const editorStyle = document.createElement("style");
  editorStyle.textContent = `
    .sceneEditorOverlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:16px;background:#050a12d9;backdrop-filter:blur(8px)}
    .sceneEditorOverlay.open{display:flex}
    .sceneEditorDialog{width:min(760px,100%);max-height:88vh;overflow:auto;background:linear-gradient(145deg,#19283d,#0e1725);border:1px solid #b99a5a70;border-radius:17px;padding:17px;box-shadow:0 24px 80px #0009}
    .sceneEditorDialog h3{margin:0 0 5px;color:#f0d9a6;font-size:16px}
    .sceneEditorDialog .editorIntro{margin:0 0 13px;color:#aebdce;font-size:12px}
    .sceneEditorFields{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .sceneEditorField{min-width:0}
    .sceneEditorField.wide{grid-column:1/-1}
    .sceneEditorField label{display:block;margin:0 0 5px;color:#d9c69d;font-size:11px;font-weight:800}
    .sceneEditorField textarea{width:100%;min-height:76px;resize:vertical;background:#090f1a;color:#f4f1e9;border:1px solid #40516a;border-radius:9px;padding:10px;font:12px/1.5 system-ui}
    .sceneEditorActions{display:flex;justify-content:flex-end;gap:8px;margin-top:13px}
    .sceneEditorActions button{min-width:100px}
    @media(max-width:600px){.sceneEditorOverlay{padding:9px}.sceneEditorDialog{padding:13px;max-height:92vh}.sceneEditorFields{grid-template-columns:1fr}.sceneEditorField.wide{grid-column:auto}.sceneEditorActions{display:grid;grid-template-columns:1fr 1fr}.sceneEditorActions button{min-width:0}}
  `;
  document.head.appendChild(editorStyle);

  const editorOverlay = document.createElement("div");
  editorOverlay.className = "sceneEditorOverlay";
  editorOverlay.innerHTML = `
    <section class="sceneEditorDialog" role="dialog" aria-modal="true" aria-labelledby="sceneEditorTitle">
      <h3 id="sceneEditorTitle">EDIT ADEGAN</h3>
      <p class="editorIntro">Ubah hanya bagian adegan ini. Adegan lainnya tetap aman.</p>
      <div class="sceneEditorFields">
        <div class="sceneEditorField"><label for="editScenePurpose">TUJUAN ADEGAN</label><textarea id="editScenePurpose"></textarea></div>
        <div class="sceneEditorField"><label for="editSceneAction">AKSI / GERAKAN</label><textarea id="editSceneAction"></textarea></div>
        <div class="sceneEditorField wide"><label for="editSceneVisual">VISUAL CERITA</label><textarea id="editSceneVisual"></textarea></div>
        <div class="sceneEditorField"><label for="editSceneDialogue">DIALOG</label><textarea id="editSceneDialogue"></textarea></div>
        <div class="sceneEditorField"><label for="editSceneNarration">NARASI</label><textarea id="editSceneNarration"></textarea></div>
        <div class="sceneEditorField wide"><label for="editSceneImage">PROMPT GAMBAR</label><textarea id="editSceneImage" style="min-height:115px"></textarea></div>
        <div class="sceneEditorField wide"><label for="editSceneVideo">PROMPT VIDEO GOOGLE FLOW</label><textarea id="editSceneVideo" style="min-height:135px"></textarea></div>
      </div>
      <div class="sceneEditorActions"><button type="button" class="secondary" id="cancelSceneEdit">BATAL</button><button type="button" class="gold" id="saveSceneEdit">SIMPAN PERUBAHAN</button></div>
    </section>`;
  document.body.appendChild(editorOverlay);
  let editingSceneIndex = -1;
  const editorFields = {
    purpose:"editScenePurpose", action:"editSceneAction", visual:"editSceneVisual",
    dialogue:"editSceneDialogue", narration:"editSceneNarration",
    imagePrompt:"editSceneImage", videoPrompt:"editSceneVideo"
  };
  const openSceneEditor = (index) => {
    if (typeof project === "undefined" || !project || !project.scenes?.[index]) return;
    editingSceneIndex = index;
    const scene = project.scenes[index];
    Object.entries(editorFields).forEach(([key,id]) => {
      document.getElementById(id).value = scene[key] || "";
    });
    document.getElementById("sceneEditorTitle").textContent = "EDIT ADEGAN " + (scene.number || index + 1);
    editorOverlay.classList.add("open");
    document.getElementById("editScenePurpose").focus();
  };
  const closeSceneEditor = () => { editorOverlay.classList.remove("open"); editingSceneIndex = -1; };
  window.AgusStudioEditScene = openSceneEditor;
  document.getElementById("cancelSceneEdit").addEventListener("click",closeSceneEditor);
  editorOverlay.addEventListener("click",event=>{if(event.target===editorOverlay)closeSceneEditor();});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&editorOverlay.classList.contains("open"))closeSceneEditor();});
  document.getElementById("saveSceneEdit").addEventListener("click",()=>{
    if (typeof project === "undefined" || !project?.scenes?.[editingSceneIndex]) return;
    const scene = project.scenes[editingSceneIndex];
    Object.entries(editorFields).forEach(([key,id])=>{scene[key]=document.getElementById(id).value.trim();});
    if (typeof render === "function") render();
    if (typeof switchTab === "function") switchTab("storyboard");
    // Keep the edited package in the same local saved-project record.
    try {
      const stored = JSON.parse(localStorage.getItem("agusStudioProjects") || "[]");
      let item = stored.find(entry=>Number(entry.id)===Number(activeProjectId));
      if (!item) {
        item = {id:Date.now(),title:project.title||"Paket Video",form:typeof getData==="function"?getData():{},savedAt:new Date().toLocaleString("id-ID")};
        activeProjectId = item.id;
        stored.unshift(item);
      }
      item.project = project;
      item.title = project.title || item.title;
      localStorage.setItem("agusStudioProjects",JSON.stringify(stored.slice(0,20)));
      localStorage.setItem("agusStudioLastProject",JSON.stringify(item));
      if (typeof renderSaved === "function") renderSaved();
      if (typeof setStatus === "function") setStatus("Adegan berhasil diperbarui dan perubahan tersimpan di perangkat ini.","ok");
    } catch(error) {
      if (typeof setStatus === "function") setStatus("Adegan diperbarui, tetapi penyimpanan gagal. Unduh paket sebagai cadangan.","err");
    }
    closeSceneEditor();
  });

  const addSceneEditorButtons = () => {
    const host = document.getElementById("storyboardView");
    if (!host || typeof project === "undefined" || !project?.scenes?.length) return;
    [...host.querySelectorAll(".scene")].forEach((card,index)=>{
      if (card.querySelector(".sceneEditorAction")) return;
      const actions=document.createElement("div");
      actions.className="actions sceneEditorAction";
      const button=document.createElement("button");
      button.type="button";button.className="secondary small";
      button.textContent="Edit adegan";
      button.addEventListener("click",()=>openSceneEditor(index));
      actions.appendChild(button);card.appendChild(actions);
    });
  };
  const sceneEditorObserver = new MutationObserver(addSceneEditorButtons);
  const storyboardHost = document.getElementById("storyboardView");
  if (storyboardHost) {
    sceneEditorObserver.observe(storyboardHost,{childList:true,subtree:true});
    addSceneEditorButtons();
  }

  window.AgusStudioNavigate = show;
  show("quickStudio",false);
})();
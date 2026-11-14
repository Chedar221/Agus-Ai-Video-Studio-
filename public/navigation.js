/* AGUS AI STUDIO — navigation and unified button icons */
(() => {
  const allPanels = [...document.querySelectorAll(".layout > .stack > .panel")];
  const flowUrl = "https://labs.google/fx/tools/flow";

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
      node.textContent = node.textContent.replace(/^\s*(?:(?:[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]|[✦↗▣▶])\uFE0F?\s*)+/u, "");
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
      icon.textContent = iconFor(el);
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
    flowLink.target = "_blank";
    flowLink.rel = "noopener noreferrer";
    flowLink.textContent = "BUKA FLOW";
    flowLink.setAttribute("aria-label", "Buka Google Flow di tab baru");
    navLinks.appendChild(flowLink);
  }
  const outputActions = document.querySelector("#outputPanel > .actions");
  if (outputActions && !document.getElementById("openGoogleFlowOutput")) {
    const flowButton = document.createElement("a");
    flowButton.id = "openGoogleFlowOutput";
    flowButton.href = flowUrl;
    flowButton.target = "_blank";
    flowButton.rel = "noopener noreferrer";
    flowButton.textContent = "BUKA FLOW";
    flowButton.setAttribute("aria-label", "Buka Google Flow di tab baru");
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
  window.AgusStudioNavigate = show;
  show("quickStudio",false);
})();
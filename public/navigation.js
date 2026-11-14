/* AGUS AI STUDIO — three-screen navigation */
(() => {
  const allPanels = [...document.querySelectorAll(".layout > .stack > .panel")];
  const flowUrl = "https://labs.google/fx/tools/flow";
  const navLinks = document.querySelector(".featureNavLinks");
  if (navLinks && !document.getElementById("openGoogleFlowNav")) {
    const flowLink = document.createElement("a");
    flowLink.id = "openGoogleFlowNav";
    flowLink.className = "featureLink";
    flowLink.href = flowUrl;
    flowLink.target = "_blank";
    flowLink.rel = "noopener noreferrer";
    flowLink.textContent = "↗ BUKA FLOW";
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
    flowButton.textContent = "↗ BUKA FLOW";
    flowButton.setAttribute("aria-label", "Buka Google Flow di tab baru");
    Object.assign(flowButton.style, {
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      textDecoration: "none", font: "700 11px system-ui", borderRadius: "10px",
      padding: "8px 11px", background: "linear-gradient(135deg,#f0d9a6,#bd8d48)",
      color: "#1b2433", border: "1px solid #e8d4a5", whiteSpace: "nowrap"
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
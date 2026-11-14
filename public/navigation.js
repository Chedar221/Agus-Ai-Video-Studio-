/* AGUS AI STUDIO — three-screen navigation */
(() => {
  const allPanels = [...document.querySelectorAll(".layout > .stack > .panel")];
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
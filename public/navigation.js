/* AGUS AI STUDIO — single-feature menu navigation */
(() => {
  const items = [
    ["ideaConcept","Ide"],
    ["productionSettings","Produksi"],
    ["storyboardStudio","Storyboard"],
    ["characterStudio","Karakter"],
    ["promptLibrary","Prompt Library"],
    ["directorStudio","Sutradara"],
    ["musicStudio","Musik"],
    ["outputPanel","Hasil"],
    ["savedProjects","Proyek"],
    ["flowGuide","Panduan Flow"]
  ];
  const $ = id => document.getElementById(id);
  const allPanels = [...document.querySelectorAll(".layout > .stack > .panel")];
  const productionExtra = $("productionGenerate");
  function show(id, scroll=true) {
    const allowed = id === "productionSettings" ? [id,"productionGenerate"] : [id];
    allPanels.forEach(panel => {
      const visible = allowed.includes(panel.id);
      panel.classList.toggle("feature-visible", visible);
      panel.setAttribute("aria-hidden", visible ? "false" : "true");
    });
    document.querySelectorAll(".featureLink[data-target]").forEach(btn => {
      const active = btn.dataset.target === id;
      btn.classList.toggle("active",active);
      if(active) btn.setAttribute("aria-current","page");
      else btn.removeAttribute("aria-current");
    });
    if(scroll) window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  }
  document.querySelectorAll(".featureLink[data-target]").forEach(btn =>
    btn.addEventListener("click",()=>show(btn.dataset.target))
  );
  window.AgusStudioNavigate = show;
  show("quickStudio",false);
})();
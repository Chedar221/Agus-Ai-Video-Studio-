(() => {
  const applyBrand = () => {
    document.title = "CHEDAR AI STUDIO — Prompt Workspace";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = "CHEDAR AI STUDIO — ruang kerja untuk cerita, storyboard, Character DNA, dan prompt video AI.";
    const heading = document.querySelector(".brand h1");
    if (heading) heading.textContent = "CHEDAR AI STUDIO";
    const subtitle = document.querySelector(".brand small");
    if (subtitle) subtitle.textContent = "AI STORY & PROMPT WORKSPACE";
    const pill = document.querySelector(".topright .pill");
    if (pill) pill.textContent = "STUDIO WORKSPACE";
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.nodeValue.includes("CHEDAR AI KREATOR")) {
        node.nodeValue = node.nodeValue.replaceAll("CHEDAR AI KREATOR", "CHEDAR AI STUDIO");
      }
    }
    const topRight = document.querySelector(".topright");
    if (topRight && !document.getElementById("homeDashboardLink")) {
      const link = document.createElement("a");
      link.id = "homeDashboardLink";
      link.href = "/";
      link.textContent = "Dashboard";
      link.style.cssText = "display:inline-flex;align-items:center;padding:7px 11px;border:1px solid #9c7a42;border-radius:9px;color:#f0d49b;font-size:11px;text-decoration:none";
      topRight.prepend(link);
    }
    const style = document.createElement("style");
    style.textContent = `
      :root{--blue:#d9b36d;--blue2:#a87c3e;--gold:#e9c987}
      input:focus,select:focus,textarea:focus{border-color:#d9b36d!important;box-shadow:0 0 0 3px #d9b36d20!important}
      .primary,.tab.active{background:linear-gradient(135deg,#f0d49b,#c3944d)!important;color:#1b160d!important;border-color:#c3944d!important}
      .num{background:#d9b36d20!important;color:#f0d49b!important}
      .pill{border-color:#80683e!important;color:#f0d49b!important}
    `;
    document.head.appendChild(style);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyBrand, {once:true});
  else applyBrand();
})();
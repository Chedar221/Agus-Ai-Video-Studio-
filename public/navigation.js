/* AGUS AI STUDIO — feature navigation */
(() => {
  const items = [
    ["ideaConcept","Ide & Konsep"],
    ["productionSettings","Pengaturan Produksi"],
    ["storyboardStudio","AI Storyboard"],
    ["characterStudio","Character Consistency PRO"],
    ["promptLibrary","Prompt Library"],
    ["directorStudio","Arahan Sutradara"],
    ["musicStudio","Music Studio"],
    ["outputPanel","Hasil Studio"],
    ["savedProjects","Proyek Tersimpan"],
    ["flowGuide","Panduan Google Flow"]
  ];
  const $ = id => document.getElementById(id);
  const go = id => { const target=$(id); if(!target)return; target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}); };
  document.querySelectorAll('.featureLink[data-target]').forEach(btn=>btn.addEventListener('click',()=>go(btn.dataset.target)));
  items.forEach(([id,label],index)=>{
    const section=$(id); if(!section)return;
    const nav=document.createElement('div'); nav.className='sectionNav';
    const prev=items[index-1],next=items[index+1];
    nav.innerHTML='<button type="button" data-dest="'+(prev?prev[0]:'featureNav')+'" '+(prev?'':'disabled')+' aria-label="Fitur sebelumnya">'+(prev?'← '+prev[1]:'Awal')+'</button>' +
      '<button type="button" data-dest="featureNav">☰ Menu fitur</button>' +
      '<button type="button" class="next" data-dest="'+(next?next[0]:'featureNav')+'" '+(next?'':'disabled')+' aria-label="Fitur berikutnya">'+(next?next[1]+' →':'Selesai ✓')+'</button>';
    nav.querySelectorAll('button[data-dest]').forEach(button=>{if(!button.disabled)button.addEventListener('click',()=>go(button.dataset.dest));});
    section.appendChild(nav);
  });
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]; if(!visible)return;
      document.querySelectorAll('.featureLink').forEach(btn=>{const active=btn.dataset.target===visible.target.id;btn.classList.toggle('active',active);if(active)btn.setAttribute('aria-current','location');else btn.removeAttribute('aria-current');});
    },{rootMargin:'-22% 0px -62% 0px',threshold:[0,.1,.35,.6]});
    items.forEach(([id])=>{if($(id))observer.observe($(id));});
  }
})();
/* CHEDAR AI KREATOR — portable project backup and restore */
(() => {
  const panel=document.getElementById("savedProjects");
  const host=document.getElementById("projectList");
  if(!panel||!host)return;
  const bar=document.createElement("div");
  bar.className="actions";
  bar.style.margin="0 0 12px";
  bar.innerHTML='<button type="button" class="gold" id="exportChedarBackup">Unduh cadangan lengkap</button><button type="button" class="secondary" id="importChedarBackup">Pulihkan cadangan</button><input id="chedarBackupFile" type="file" accept=".json,application/json" hidden>';
  panel.insertBefore(bar,host);
  const status=document.createElement("p");
  status.className="status";status.id="chedarBackupStatus";status.setAttribute("role","status");
  panel.insertBefore(status,host);
  const read=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key)||"null");return value??fallback;}catch{return fallback;}};
  const safeName=value=>String(value||"CHEDAR-AI-KREATOR").normalize("NFKD").replace(/[^a-z0-9-_]+/gi,"-").replace(/^-+|-+$/g,"").slice(0,70)||"CHEDAR-AI-KREATOR";
  document.getElementById("exportChedarBackup").addEventListener("click",()=>{
    const projects=read("agusStudioProjects",[]);
    const last=read("agusStudioLastProject",null);
    if(!projects.length&&!last){status.textContent="Belum ada proyek tersimpan untuk dicadangkan.";status.className="status err";return;}
    const payload={app:"CHEDAR AI KREATOR",formatVersion:1,exportedAt:new Date().toISOString(),projects,lastProject:last};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="CHEDAR-AI-KREATOR-BACKUP-"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
    status.textContent="Cadangan berhasil diunduh. Simpan file JSON ini di tempat aman.";status.className="status ok";
  });
  const picker=document.getElementById("chedarBackupFile");
  document.getElementById("importChedarBackup").addEventListener("click",()=>picker.click());
  picker.addEventListener("change",async()=>{
    const file=picker.files?.[0];if(!file)return;
    try{
      const data=JSON.parse(await file.text());
      if(!data||data.app!=="CHEDAR AI KREATOR"||!Array.isArray(data.projects))throw new Error("File bukan cadangan CHEDAR AI KREATOR yang valid.");
      const incoming=data.projects.filter(x=>x&&x.project&&Array.isArray(x.project.scenes));
      if(!incoming.length&&!data.lastProject?.project?.scenes?.length)throw new Error("File cadangan tidak berisi proyek yang dapat dipulihkan.");
      if(!confirm("Pulihkan "+incoming.length+" proyek dari cadangan? Proyek yang sudah ada dengan ID sama akan diperbarui."))return;
      const current=read("agusStudioProjects",[]),byId=new Map(current.map(x=>[String(x.id),x]));
      for(const item of incoming)byId.set(String(item.id),item);
      const merged=[...byId.values()].sort((a,b)=>Number(b.id||0)-Number(a.id||0));
      localStorage.setItem("agusStudioProjects",JSON.stringify(merged));
      const last=data.lastProject;
      if(last?.project?.scenes?.length)localStorage.setItem("agusStudioLastProject",JSON.stringify(last));
      if(typeof window.renderSaved==="function")window.renderSaved();
      host.innerHTML="";
      if(typeof window.AgusStudioNavigate==="function")window.AgusStudioNavigate("savedProjects");
      status.textContent="Pemulihan selesai. "+incoming.length+" proyek berhasil digabungkan dengan daftar proyek di perangkat ini.";status.className="status ok";
      location.reload();
    }catch(error){status.textContent=error.message||"Gagal membaca file cadangan.";status.className="status err";}
    finally{picker.value="";}
  });
})();

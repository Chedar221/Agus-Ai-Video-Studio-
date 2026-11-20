(() => {
const style=document.createElement("style");style.textContent=`
html.admin-locked #productionSettings,html.admin-locked #promptLibrary,html.admin-locked #advancedPromptStudio{display:none!important}
#adminAccessButton{border:1px solid #b99a5a;background:linear-gradient(135deg,#f0dba9,#c49a58);color:#17202c;font-weight:900}
#adminAccessButton.admin-on{background:#173b30;border-color:#4b9c7c;color:#b8f0d7}
.adminOverlay{position:fixed;inset:0;z-index:5000;display:none;align-items:center;justify-content:center;padding:16px;background:#050a12df;backdrop-filter:blur(9px)}.adminOverlay.open{display:flex}
.adminDialog{width:min(420px,100%);background:linear-gradient(145deg,#1a2a40,#0d1726);border:1px solid #c49a58;border-radius:18px;padding:20px;box-shadow:0 24px 90px #000a}
.adminDialog h2{font-size:19px;color:#f0d9a6;margin:0 0 5px}.adminDialog p{font-size:12px;color:#aebdce;margin:0 0 15px}
.adminDialog label{display:block;font-size:11px;color:#e2d0a8;margin:10px 0 5px}.adminDialog input{width:100%;font-size:16px;background:#091321;border:1px solid #40516a;color:#fff;border-radius:10px;padding:12px}
.adminDialog .adminActions{display:flex;gap:8px;margin-top:15px}.adminDialog button{flex:1;min-height:43px}#adminLoginStatus{font-size:12px;min-height:18px;margin-top:9px;color:#ffaaaa}#adminLoginStatus.ok{color:#75d5a9}`;
document.head.appendChild(style);document.documentElement.classList.add("admin-locked");
const overlay=document.createElement("div");overlay.className="adminOverlay";overlay.innerHTML=`
<section class="adminDialog" role="dialog" aria-modal="true" aria-labelledby="adminLoginTitle"><h2 id="adminLoginTitle">LOGIN ADMIN</h2><p>Masuk untuk membuka fitur studio lanjutan dan pengaturan teknis.</p>
<form id="adminLoginForm"><label for="adminEmail">EMAIL ADMIN</label><input id="adminEmail" type="email" autocomplete="username" required placeholder="Email admin">
<label for="adminPassword">PASSWORD</label><input id="adminPassword" type="password" autocomplete="current-password" required placeholder="Password admin">
<div class="adminActions"><button type="button" class="secondary" id="adminCancel">BATAL</button><button type="submit" class="gold" id="adminSubmit">MASUK</button></div><div id="adminLoginStatus" role="status"></div></form></section>`;
document.body.appendChild(overlay);const nav=document.querySelector(".topright")||document.querySelector(".top"),access=document.createElement("button");
access.type="button";access.id="adminAccessButton";access.className="small";access.textContent="LOGIN ADMIN";nav?.appendChild(access);
const status=document.getElementById("adminLoginStatus"),setStatus=(m,ok=false)=>{status.textContent=m;status.classList.toggle("ok",ok);};
const setAdmin=(enabled,email="")=>{document.documentElement.classList.toggle("admin-locked",!enabled);access.classList.toggle("admin-on",enabled);access.textContent=enabled?"ADMIN · KELUAR":"LOGIN ADMIN";access.title=enabled?"Keluar dari akun admin "+email:"Masuk sebagai admin";
document.querySelectorAll("#videoType option").forEach(o=>{if(["lipsync","motion_control"].includes(o.value))o.disabled=!enabled;});
if(!enabled&&["lipsync","motion_control"].includes(document.getElementById("videoType")?.value)){const s=document.getElementById("videoType");s.value="auto";s.dispatchEvent(new Event("change"));}};
const check=async()=>{try{const r=await fetch("/api/admin-auth",{credentials:"same-origin",cache:"no-store"}),d=await r.json();setAdmin(Boolean(d.authenticated),d.email||"");if(!d.configured)access.title="Login admin belum dikonfigurasi di Vercel";}catch{setAdmin(false);}};
const open=()=>{overlay.classList.add("open");setStatus("");document.getElementById("adminEmail").focus();},close=()=>overlay.classList.remove("open");
access.addEventListener("click",async()=>{if(access.classList.contains("admin-on")){try{await fetch("/api/admin-auth",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"logout"})});}finally{setAdmin(false);}}else open();});
document.getElementById("adminCancel").addEventListener("click",close);overlay.addEventListener("click",e=>{if(e.target===overlay)close();});document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
document.getElementById("adminLoginForm").addEventListener("submit",async e=>{e.preventDefault();const b=document.getElementById("adminSubmit");b.disabled=true;setStatus("Memeriksa akun admin...");
try{const r=await fetch("/api/admin-auth",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"login",email:document.getElementById("adminEmail").value,password:document.getElementById("adminPassword").value})}),d=await r.json();if(!r.ok)throw new Error(d.error||"Login gagal.");document.getElementById("adminPassword").value="";setAdmin(true,d.email||"");setStatus("Login berhasil. Fitur admin sudah terbuka.",true);setTimeout(close,550);}catch(err){setStatus(err.message||"Tidak dapat menghubungi server.");}finally{b.disabled=false;}});
check();
})();
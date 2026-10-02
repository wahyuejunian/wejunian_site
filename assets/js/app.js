const $=s=>document.querySelector(s),app=$('#app'),J=u=>fetch(u).then(r=>r.json()),T=u=>fetch(u).then(r=>r.text());
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const U=encodeURI,pad=n=>String(n).padStart(2,'0');
let S,C,B,P,F,PUB=[],STU=[],CH={},SRC={};
function csv(t){const r=[];let w=[],f='',q=0;for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c=='"'){if(t[i+1]=='"'){f+='"';i++}else q=0}else f+=c}else if(c=='"')q=1;else if(c==','){w.push(f);f=''}else if(c=='\n'||c=='\r'){if(c=='\r'&&t[i+1]=='\n')i++;w.push(f);r.push(w);w=[];f=''}else f+=c}if(f||w.length){w.push(f);r.push(w)}const h=r.shift();return r.filter(x=>x.length>1).map(x=>Object.fromEntries(h.map((k,i)=>[k.trim(),(x[i]||'').trim()])))}
const sec=(id,h,sub,body)=>`<section id="${id}"><div class="w"><div class="sh"><h2>${h}</h2>${sub?`<p>${sub}</p>`:''}</div>${body}</div></section>`;
const nf=()=>`<div class="w page"><h1>Halaman tidak ditemukan</h1><a href="#/">← Beranda</a></div>`;
const fl=f=>`<li><a href="${U(f.p)}" target="_blank" rel="noopener"><i class="ext">${e(f.n.split('.').pop())}</i>${e(f.n)}</a></li>`;
const nfiles=id=>Object.values(F.materi[id]||{}).reduce((a,v)=>a+v.length,0);
const srcNote=n=>`<p class="mut" style="font-size:.82rem;margin:8px 0 0">Sumber data: ${SRC[n]=='sheets'?'Google Sheets (realtime)':'berkas CSV lokal — hubungkan Google Sheets lewat <code>sheets</code> di data/site.json'}</p>`;
const col=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function chart(id,cfg){const c=$('#'+id);if(!c||!window.Chart)return;if(CH[id]&&CH[id].canvas===c){CH[id].data=cfg.data;CH[id].update();return}CH[id]?.destroy();Chart.defaults.color=col('--mut');Chart.defaults.font.family='Inter,sans-serif';Chart.defaults.borderColor=col('--line');cfg.options={maintainAspectRatio:false,...cfg.options};CH[id]=new Chart(c,cfg)}
const cnt=(a,f)=>a.reduce((o,x)=>{const k=f(x)||'—';o[k]=(o[k]||0)+1;return o},{});
const box=(h,id)=>`<div class="card"><h4>${h}</h4><div class="ch"><canvas id="${id}"></canvas></div></div>`;
function drawPub(){const y=cnt(PUB,p=>p.tahun),yk=Object.keys(y).sort(),j=cnt(PUB,p=>p.jurnal),jk=Object.keys(j).sort((a,b)=>j[b]-j[a]).slice(0,8);
chart('c1',{type:'bar',data:{labels:yk,datasets:[{label:'Publikasi',data:yk.map(k=>y[k]),backgroundColor:col('--ac'),borderRadius:6}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
chart('c2',{type:'bar',data:{labels:jk,datasets:[{label:'Publikasi',data:jk.map(k=>j[k]),backgroundColor:col('--ac2'),borderRadius:6}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,ticks:{precision:0}},y:{ticks:{callback(v){const l=this.getLabelForValue(v);return l.length>28?l.slice(0,27)+'…':l}}}}}})}
function pubView(){return `<div class="cg">${box('Publikasi per tahun','c1')}${box('Berdasarkan jurnal','c2')}</div>`+pubTable()+srcNote('publications')}
function pubTable(){return `<div class="tw"><table><tr><th>Tahun</th><th>Judul</th><th>Jurnal</th></tr>${PUB.map(p=>`<tr><td>${e(p.tahun)}</td><td><a href="${e(p.link)}" target="_blank" rel="noopener">${e(p.judul)}</a></td><td>${e(p.jurnal)}</td></tr>`).join('')}</table></div>`}
function stuTable(){const ang=[...new Set(STU.map(s=>s.angkatan))].sort();return `<div class="tb"><input id="q" placeholder="Cari nama atau judul…"><select id="fa"><option value="">Semua angkatan</option>${ang.map(a=>`<option>${a}</option>`).join('')}</select><select id="fs"><option value="">Semua status</option><option>Lulus</option><option>Berjalan</option></select></div><div class="cg">${box('Mahasiswa per angkatan','c3')}${box('Status bimbingan','c4')}</div><div class="tw"><table><thead><tr><th>Angkatan</th><th>Nama</th><th>Judul Tugas Akhir</th><th>Pembimbing</th><th>Status</th></tr></thead><tbody id="sb"></tbody></table></div>`+srcNote('students')}
function stuRows(){const q=$('#q').value.toLowerCase(),a=$('#fa').value,s=$('#fs').value,R=STU.filter(x=>(!a||x.angkatan==a)&&(!s||x.status==s)&&(x.nama+x.judul).toLowerCase().includes(q));
$('#sb').innerHTML=R.map(x=>`<tr><td>${e(x.angkatan)}</td><td>${e(x.nama)}</td><td>${x.link?`<a href="${e(x.link)}" target="_blank" rel="noopener">${e(x.judul)}</a>`:e(x.judul)}</td><td>${[x.pembimbing1,x.pembimbing2,x.pembimbing3].filter(Boolean).map(e).join('<br>')}</td><td><span class="st ${x.status=='Lulus'?'j':''}">${e(x.status)}</span></td></tr>`).join('');
const k=[...new Set(R.map(x=>x.angkatan))].sort(),n=(g,st)=>R.filter(x=>x.angkatan==g&&x.status==st).length,tot=cnt(R,x=>x.status);
chart('c3',{type:'bar',data:{labels:k,datasets:[{label:'Lulus',data:k.map(g=>n(g,'Lulus')),backgroundColor:col('--ac'),borderRadius:4},{label:'Berjalan',data:k.map(g=>n(g,'Berjalan')),backgroundColor:col('--ac2'),borderRadius:4}]},options:{scales:{x:{stacked:true},y:{stacked:true,beginAtZero:true,ticks:{precision:0}}}}});
chart('c4',{type:'doughnut',data:{labels:Object.keys(tot),datasets:[{data:Object.values(tot),backgroundColor:Object.keys(tot).map(s=>s=='Lulus'?col('--ac'):col('--ac2')),borderWidth:0}]},options:{cutout:'62%'}})}
function home(){
return `<section class="hero"><canvas id="cv"></canvas><div class="w hh"><div><p class="eyebrow">${e(S.jabatan)} · ${e(S.institusi)}</p><h1>${e(S.nama)}</h1><p class="lead">${e(S.tagline)}</p><div class="btns"><a class="b p" href="#/s/penelitian">Lihat penelitian</a><a class="b" href="#/s/kuliah">Materi kuliah</a><a class="b" href="#/s/ebook">Ebook</a></div></div><img class="foto" src="${S.foto}" alt="${e(S.nama)}"></div>
<div class="w stats"><div><b>${PUB.length}</b><span>Publikasi</span></div><div><b>${STU.filter(s=>s.status=='Lulus').length}</b><span>Bimbingan lulus</span></div><div><b>${C.length}</b><span>Mata kuliah</span></div><div><b>${B.length}</b><span>Ebook</span></div></div></section>`
+sec('tentang','Tentang',0,`<div class="two"><div><p>${e(S.tentang)}</p><h4>Minat</h4><div class="chips">${S.minat.map(m=>`<span>${e(m)}</span>`).join('')}</div><h4 style="margin-top:22px">Keahlian</h4><div class="chips">${S.skill.map(m=>`<span>${e(m)}</span>`).join('')}</div></div><div>${S.pendidikan.map(p=>`<div class="edu"><b>${e(p.jenjang)}</b><small>${e(p.institusi)} · ${e(p.tahun)}</small><p class="mut" style="margin:6px 0 0;font-size:.9rem">${e(p.judul)}</p></div>`).join('')}</div></div>`)
+sec('penelitian','Penelitian','Publikasi dan data penelitian, dibaca langsung dari Google Sheets.',pubView())
+sec('bimbingan','Mahasiswa Bimbingan','Tugas akhir yang dibimbing, per angkatan dan status.',stuTable())
+sec('kuliah','Mata Kuliah','Pilih mata kuliah untuk membuka materi per pertemuan.',`<div class="g">${C.map(c=>`<a class="card" href="#/kuliah/${c.id}"><span class="tag">${e(c.kelompok)}</span><h3>${e(c.nama)}</h3><p>${e(c.deskripsi)}</p><small>${nfiles(c.id)} berkas materi</small></a>`).join('')}</div>`)
+sec('ebook','Ebook','Bahan bacaan yang ditulis dalam Markdown.',`<div class="g">${B.map(b=>`<a class="card" href="#/ebook/${b.id}/0"><span class="tag">Ebook</span><h3>${e(b.judul)}</h3><p>${e(b.deskripsi)}</p><small>${(F.bab[b.id]||[]).length} bab</small></a>`).join('')}</div>`)
+sec('proyek','Proyek & Dokumen','Kode, visualisasi, dan modul pengolahan data.',`<div class="g">${P.map(p=>`<a class="card pj" href="${U(p.url)}" target="_blank" rel="noopener"><img src="assets/img/proyek/${p.img}" alt="" loading="lazy"><span class="tag">${e(p.k)}</span><h3>${e(p.t)}</h3></a>`).join('')}</div>`)
+sec('kontak','Kontak',0,`<div class="card"><p><b>${e(S.institusi)}</b><br>Teknik Geofisika · ${e(S.lokasi)}</p><p><a href="mailto:${S.email}">${e(S.email)}</a></p><div class="chips">${Object.entries(S.tautan).map(([k,v])=>`<a class="b" href="${e(v)}" target="_blank" rel="noopener">${e(k)}</a>`).join('')}</div></div>`)}
function course(id){const c=C.find(x=>x.id==id);if(!c)return nf();const M=F.materi[id]||{},tp={};(c.topik||[]).forEach(([a,b,n])=>{for(let i=a;i<=b;i++)tp[i]=n});
let r='';for(let i=1;i<=(c.pertemuan||16);i++){const f=M[pad(i)]||[];r+=`<details class="mt" ${f.length?'open':''}><summary><b>${i}</b><span>${e(tp[i]||'Topik belum diisi')}</span><em>${f.length?f.length+' berkas':'—'}</em></summary>${f.length?`<ul class="fl">${f.map(fl).join('')}</ul>`:'<p class="mut" style="margin:0 0 14px">Materi belum diunggah.</p>'}</details>`}
const u=M.umum||[];return `<div class="w page"><a class="back" href="#/s/kuliah">← Semua mata kuliah</a><span class="tag">${e(c.kelompok)}</span><h1>${e(c.nama)}</h1><p class="mut">${e(c.deskripsi)}</p>${u.length?`<h3>Dokumen umum (RPS, silabus, dll.)</h3><div class="mt"><ul class="fl">${u.map(fl).join('')}</ul></div>`:''}<h3 style="margin-top:28px">Materi per pertemuan</h3>${r}</div>`}
function md(t){const m=[];t=t.replace(/\\\[([\s\S]+?)\\\]|\$\$([\s\S]+?)\$\$|\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g,(a,b,c,d,x)=>{m.push([b||c||d||x,!!(b||c)]);return `@@M${m.length-1}@@`});
return marked.parse(t).replace(/@@M(\d+)@@/g,(a,i)=>katex.renderToString(m[i][0],{displayMode:m[i][1],throwOnError:false}))}
function reader(id,i){const b=B.find(x=>x.id==id);if(!b)return nf();return `<div id="pb"></div><div class="w rd"><aside><a href="#/s/ebook">← Semua ebook</a><h4 style="margin-top:14px">${e(b.judul)}</h4><ol>${(F.bab[id]||[]).map((x,k)=>`<li><a class="${k==i?'on':''}" href="#/ebook/${id}/${k}">${e(x.judul)}</a></li>`).join('')}</ol></aside><article id="ch" class="prose">Memuat…</article></div>`}
async function loadCh(id,i){const bab=F.bab[id]||[],x=bab[i],el=$('#ch');if(!x){el.innerHTML=`<p>Belum ada bab. Taruh berkas .md di <code>ebook/${e(id)}/</code>.</p>`;return}
el.innerHTML=md(await T(U(x.file)))+`<div class="pn">${i>0?`<a class="b" href="#/ebook/${id}/${i-1}">← ${e(bab[i-1].judul)}</a>`:'<span></span>'}${i<bab.length-1?`<a class="b p" href="#/ebook/${id}/${i+1}">${e(bab[i+1].judul)} →</a>`:''}</div>`}
function waves(){const c=$('#cv');if(!c)return;const x=c.getContext('2d'),d=devicePixelRatio||1,still=matchMedia('(prefers-reduced-motion:reduce)').matches;let t=0;const rs=()=>{c.width=c.offsetWidth*d;c.height=c.offsetHeight*d};rs();
(function f(){if(!c.isConnected)return;const W=c.width,H=c.height;x.clearRect(0,0,W,H);x.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--ac2');x.lineWidth=1.4*d;
for(let i=0;i<14;i++){x.beginPath();x.globalAlpha=.06+i*.014;for(let p=0;p<=W;p+=8){const y=H*(.3+i*.045)+Math.sin(p/(170+i*14)+t+i*.5)*(16+i*3)*d;p?x.lineTo(p,y):x.moveTo(p,y)}x.stroke()}
if(!still){t+=.012;requestAnimationFrame(f)}})()}
let cur='';
function render(){const p=location.hash.replace(/^#\/?/,'').split('/'),home_=!p[0]||p[0]=='s';
if(home_&&cur=='home'){if(p[1])document.getElementById(p[1])?.scrollIntoView();else scrollTo(0,0);return}
app.innerHTML=p[0]=='kuliah'&&p[1]?course(p[1]):p[0]=='ebook'&&p[1]?reader(p[1],+p[2]||0):home_?home():nf();
cur=home_?'home':p[0];
if(home_){waves();drawPub();stuRows();['q','fa','fs'].forEach(i=>$('#'+i).addEventListener('input',stuRows));if(p[1])setTimeout(()=>document.getElementById(p[1])?.scrollIntoView(),30);else scrollTo(0,0)}
else{scrollTo(0,0);if(p[0]=='ebook')loadCh(p[1],+p[2]||0)}}
addEventListener('scroll',()=>{const b=$('#pb');if(b)b.style.setProperty('--p',scrollY/(document.body.scrollHeight-innerHeight)*100+'%')});
addEventListener('hashchange',render);
$('#tg').onclick=()=>{const t=document.documentElement.dataset.t=='dark'?'light':'dark';document.documentElement.dataset.t=t;localStorage.t=t;Object.values(CH).forEach(c=>c.destroy());CH={};if(cur=='home'){drawPub();stuRows()}};
$('#yr').textContent=new Date().getFullYear();
(async()=>{[S,C,B,P,F]=await Promise.all(['site','courses','ebooks','projects','files'].map(n=>J(`data/${n}.json`)));
const src=async(n,k)=>{const u=S.sheets&&S.sheets[k];if(u){try{const r=await fetch(u);if(r.ok){const d=csv(await r.text());if(d.length){SRC[n]='sheets';return d}}}catch(_){}}return csv(await T(`data/${n}.csv`))};
[PUB,STU]=await Promise.all([src('publications','penelitian'),src('students','mahasiswa')]);STU.forEach(s=>s.status=(s.status||'').trim());document.title=S.nama+' — '+S.jabatan;render()})();

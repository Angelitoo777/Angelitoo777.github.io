
async function fetchJSON(path){ try{ const r = await fetch(path); if(!r.ok) throw r; return await r.json(); } catch(e){ console.error('fetch',path,e); return null } }
function $(s){ return document.querySelector(s) }
function create(tag, cls){ const el = document.createElement(tag); if(cls) el.className = cls; return el }
document.addEventListener('DOMContentLoaded', async ()=>{
  const profile = await fetchJSON('./data/profile.json')
  const projects = await fetchJSON('./data/projects.json') || []
  const exp = await fetchJSON('./data/experience.json') || []
  const skills = await fetchJSON('./data/skills.json') || []
  if(profile){
    $('#name').textContent = profile.name; $('#title').textContent = profile.title; $('#bio').textContent = profile.bio; $('#avatar').src = profile.avatar; if(profile.email) $('#contact-email').href='mailto:'+profile.email; if(profile.linkedin) $('#linkedin').href=profile.linkedin;
  }
  const highlights = projects.filter(p=>p.highlight); const highC = $('#highlights'); highlights.forEach(p=> highC.appendChild(renderProject(p)))
  const otherC = $('#others'); projects.filter(p=>!p.highlight).forEach(p=> otherC.appendChild(renderProject(p)))
  const tl = $('#timeline'); exp.forEach(e=>{ const item = create('div','timeline-item card reveal hover-lift'); const h=create('h4'); h.textContent = e.role + ' @ ' + e.company; item.appendChild(h); const p = create('p'); p.className='muted'; p.textContent = e.period; item.appendChild(p); const d = create('p'); d.textContent = e.desc; item.appendChild(d); tl.appendChild(item)})
  const skc = $('#skills'); skills.forEach(s=>{ const sp = create('div','skill'); sp.textContent=s; skc.appendChild(sp) })
  const obs = new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('visible') }) },{threshold:0.12}); document.querySelectorAll('.reveal').forEach(n=>obs.observe(n))
  const themeBtn = $('#theme-btn'); const stored = localStorage.getItem('theme'); if(stored === 'light') document.documentElement.classList.add('light'); themeBtn.addEventListener('click', ()=>{ document.documentElement.classList.toggle('light'); localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark') })
  document.querySelectorAll('a[href^="#"]').forEach(a=>{ a.addEventListener('click', e=>{ e.preventDefault(); document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth', block:'start'}) }) })
})
function renderProject(p){ const card = create('article','card reveal hover-lift'); const img = create('img','project-img'); img.src = p.image; img.alt = p.name; card.appendChild(img); const h = create('h3'); h.textContent = p.name; card.appendChild(h); const d = create('p'); d.className='muted'; d.textContent = p.desc; card.appendChild(d); const techs = create('div','techs'); (p.tech||p.technologies||[]).forEach(t=>{ const s = create('span','tech'); s.textContent = t; techs.appendChild(s) }); card.appendChild(techs); const actions = create('div','mt actions'); const repo = create('a','btn-ghost'); repo.textContent='Ver Repo'; repo.href=p.repo; repo.target='_blank'; actions.appendChild(repo); if(p.demo){ const demo = create('a','btn-primary'); demo.textContent='Demo'; demo.href=p.demo; demo.target='_blank'; demo.style.marginLeft='8px'; actions.appendChild(demo) } card.appendChild(actions); return card }

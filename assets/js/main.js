
async function loadJSON(path){ try{ const r=await fetch(path); if(!r.ok) throw r; return await r.json(); } catch(e){ console.error(e); return null } }
function create(tag, cls){ const el=document.createElement(tag); if(cls) el.className=cls; return el }
document.addEventListener('DOMContentLoaded', async ()=>{
  const profile = await loadJSON('./data/profile.json');
  const projects = await loadJSON('./data/projects.json') || [];
  if(profile){
    document.getElementById('name').textContent = profile.name;
    document.getElementById('title').textContent = profile.title + ' — ' + profile.location;
    document.getElementById('bio').textContent = profile.bio;
    document.getElementById('avatar').src = profile.avatar;
    document.getElementById('contact-email').href = 'mailto:' + profile.email;
    document.getElementById('linkedin').href = profile.linkedin;
  }
  // projects
  const highlights = projects.filter(p=>p.highlight);
  const highC = document.getElementById('highlights');
  highlights.forEach(p=> highC.appendChild(renderProject(p)));
  const otherC = document.getElementById('others');
  projects.filter(p=>!p.highlight).forEach(p=> otherC.appendChild(renderProject(p)));
  // reveal observer
  const obs = new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('visible') }) }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(n=> obs.observe(n));
  // smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=> a.addEventListener('click', e=>{ e.preventDefault(); document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth', block:'start'}); }));
  // small parallax on hero image
  const heroRight = document.querySelector('.hero-right');
  window.addEventListener('mousemove', e=>{
    const w = window.innerWidth;
    const rel = (e.clientX - w/2) / (w/2);
    if(heroRight) heroRight.style.transform = 'translateX(' + (rel*6) + 'px)';
  });
});

function renderProject(p){
  const card = create('article','card project-card reveal');
  const img = create('img','project-img'); img.src = p.image; img.alt = p.name; card.appendChild(img);
  const h = create('h3'); h.textContent = p.name; card.appendChild(h);
  const d = create('p'); d.className = 'muted'; d.textContent = p.desc; card.appendChild(d);
  const techs = create('div','techs');
  (p.tech||p.technologies||[]).slice(0,6).forEach(t=>{
    const s = create('span','tech'); s.textContent = t; techs.appendChild(s);
  });
  card.appendChild(techs);
  const actions = create('div'); actions.style.marginTop = '12px';
  const repo = create('a','btn-ghost'); repo.textContent = 'Ver Repo'; repo.href = p.repo; repo.target='_blank'; actions.appendChild(repo);
  if(p.demo){ const demo = create('a','btn-primary'); demo.textContent = 'Demo'; demo.href = p.demo; demo.target='_blank'; demo.style.marginLeft='10px'; actions.appendChild(demo) }
  card.appendChild(actions);
  return card;
}

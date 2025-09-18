// main.js - load data, render projects, reveal, parallax, cursor
async function fetchJSON(path){ try{ const r = await fetch(path); if(!r.ok) throw new Error('fetch'); return await r.json(); }catch(e){ console.error('fetch error',path,e); return null; } }

function el(tag, cls){ const e=document.createElement(tag); if(cls) e.className=cls; return e; }

document.addEventListener('DOMContentLoaded', async ()=>{
  const profile = await fetchJSON('data/profile.json');
  const projects = await fetchJSON('data/projects.json') || [];
  // populate hero
  if(profile){
    const nameEl = document.querySelector('.hero-title'); if(nameEl) nameEl.textContent = profile.name;
    const lead = document.querySelector('.lead'); if(lead) lead.textContent = profile.bio;
    const avatarImg = document.querySelector('.hero-right img'); if(avatarImg) avatarImg.src = profile.avatar;
    const mailBtns = document.querySelectorAll('a[href^="mailto:"]'); mailBtns.forEach(a=>{ a.href = 'mailto:'+profile.email; a.textContent = profile.email; });
    const linkedin = document.querySelector('.btn-linkedin'); if(linkedin) linkedin.href = profile.linkedin;
  }

  // render projects
  const grid = document.querySelector('.grid-3');
  if(grid && Array.isArray(projects)){
    grid.innerHTML='';
    projects.forEach(p => {
      const card = el('div','card project-card reveal');
      const img = el('img','project-img'); img.src = p.image; img.alt = p.name; card.appendChild(img);
      const h = el('h3'); h.textContent = p.name; card.appendChild(h);
      const d = el('p'); d.textContent = p.desc; card.appendChild(d);
      const actions = el('div'); actions.style.marginTop='12px';
      if(p.repo){ const a = el('a','btn-ghost'); a.href=p.repo; a.target='_blank'; a.textContent='Ver Repo'; actions.appendChild(a); }
      if(p.demo){ const b = el('a','btn-primary'); b.href=p.demo; b.target='_blank'; b.style.marginLeft='8px'; b.textContent='Demo'; actions.appendChild(b); }
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  // reveal observer
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('visible'); });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(n=>obs.observe(n));

  // simple parallax on hero-right
  const heroRight = document.querySelector('.hero-right');
  window.addEventListener('mousemove', e=>{ if(!heroRight) return; const w=window.innerWidth; const rel=(e.clientX - w/2)/(w/2); heroRight.style.transform='translateX(' + (rel*8) + 'px)'; });

  // custom cursor
  const cursor = document.createElement('div'); cursor.className='cursor'; document.body.appendChild(cursor);
  window.addEventListener('mousemove', e=>{ cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px'; });
  // enlarge cursor on link hover
  document.querySelectorAll('a, button').forEach(a=>{
    a.addEventListener('mouseenter', ()=>{ cursor.style.transform='translate(-50%,-50%) scale(1.6)'; cursor.style.borderColor='var(--accent2)'; cursor.style.background='rgba(124,58,237,0.06)'; });
    a.addEventListener('mouseleave', ()=>{ cursor.style.transform='translate(-50%,-50%) scale(1)'; cursor.style.borderColor='rgba(124,58,237,0.9)'; cursor.style.background='transparent'; });
  });
});
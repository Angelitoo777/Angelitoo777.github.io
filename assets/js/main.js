/* assets/js/main.js - versión corregida y resistente a elementos faltantes */
(async function(){
  'use strict';

  async function loadJSON(path){
    try{
      const r = await fetch(path);
      if(!r.ok) throw new Error('Fetch failed: ' + path);
      return await r.json();
    }catch(e){
      console.error('loadJSON error for', path, e);
      return null;
    }
  }

  function create(tag, cls){ const el = document.createElement(tag); if(cls) el.className = cls; return el; }

  function safeSetText(id, text){
    const el = document.getElementById(id);
    if(el && typeof text !== 'undefined') el.textContent = text;
  }
  function safeSetHref(id, href){
    const el = document.getElementById(id);
    if(el && href) el.href = href;
  }
  function safeSetSrc(id, src){
    const el = document.getElementById(id);
    if(el && src) el.src = src;
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    try {
      const profile = await loadJSON('./data/profile.json');
      const projects = await loadJSON('./data/projects.json') || [];

      // populate profile fields safely
      if(profile){
        safeSetText('name', profile.name || '');
        safeSetText('title', (profile.title || '') + (profile.location ? ' — ' + profile.location : ''));
        safeSetText('bio', profile.bio || '');
        safeSetSrc('avatar', profile.avatar || './assets/images/avatar.png');
        safeSetHref('contact-email', profile.email ? 'mailto:' + profile.email : '#');
        safeSetHref('contact-email-2', profile.email ? 'mailto:' + profile.email : '#');
        safeSetHref('linkedin', profile.linkedin || '#');
      }

      // Projects: highlights + optional others (only if container exists)
      const highlights = Array.isArray(projects) ? projects.filter(p=>p.highlight) : [];
      const highC = document.getElementById('highlights');
      if(highC && highlights.length){
        highlights.forEach(p => {
          try { highC.appendChild(renderProject(p)); }
          catch(err){ console.error('append highlight failed', p, err); }
        });
      }

      const otherC = document.getElementById('others');
      if(otherC){
        const others = Array.isArray(projects) ? projects.filter(p=>!p.highlight) : [];
        others.forEach(p => {
          try { otherC.appendChild(renderProject(p)); }
          catch(err){ console.error('append other project failed', p, err); }
        });
      }

      // Reveal animations (IntersectionObserver)
      const revealNodes = document.querySelectorAll('.reveal');
      if(revealNodes && revealNodes.length){
        const obs = new IntersectionObserver(entries=>{
          entries.forEach(en=>{
            if(en.isIntersecting) en.target.classList.add('visible');
          });
        }, { threshold: 0.12 });
        revealNodes.forEach(n => obs.observe(n));
      }

      // Smooth anchor scrolling
      document.querySelectorAll('a[href^="#"]').forEach(a=>{
        a.addEventListener('click', e=>{
          const href = a.getAttribute('href');
          if(href && href.startsWith('#')){
            e.preventDefault();
            const target = document.querySelector(href);
            if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      // small parallax on hero image (only if element exists)
      const heroRight = document.querySelector('.hero-right');
      if(heroRight){
        window.addEventListener('mousemove', e=>{
          const w = window.innerWidth || 1;
          const rel = (e.clientX - w/2) / (w/2);
          heroRight.style.transform = 'translateX(' + (rel * 6) + 'px)';
        });
      }

    } catch (err) {
      console.error('Initialization error', err);
    }
  });

  function renderProject(p){
    const card = create('article','card project-card reveal');
    try{
      if(p.image){
        const img = create('img','project-img'); img.src = p.image; img.alt = p.name || 'project'; card.appendChild(img);
      }
      const h = create('h3'); h.textContent = p.name || 'Proyecto'; card.appendChild(h);
      const d = create('p'); d.className = 'muted'; d.textContent = p.desc || ''; card.appendChild(d);

      const techs = create('div','techs');
      const list = (p.tech || p.technologies || []);
      list.slice(0,6).forEach(t=>{
        const s = create('span','tech'); s.textContent = t; techs.appendChild(s);
      });
      card.appendChild(techs);

      const actions = create('div'); actions.style.marginTop = '12px';
      if(p.repo){
        const repo = create('a','btn-ghost'); repo.textContent = 'Ver Repo'; repo.href = p.repo; repo.target = '_blank'; actions.appendChild(repo);
      }
      if(p.demo){
        const demo = create('a','btn-primary'); demo.textContent = 'Demo'; demo.href = p.demo; demo.target = '_blank'; demo.style.marginLeft = '10px'; actions.appendChild(demo);
      }
      card.appendChild(actions);

    } catch(e){
      console.error('renderProject error', e, p);
    }
    return card;
  }

})();

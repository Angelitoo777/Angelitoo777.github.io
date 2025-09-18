
async function loadJSON(path){try{const r=await fetch(path);if(!r.ok)throw r;return await r.json()}catch(e){console.error(e);return null}}
function el(sel){return document.querySelector(sel)}
function create(tag, cls){const d=document.createElement(tag); if(cls) d.className=cls; return d}
document.addEventListener('DOMContentLoaded', async ()=>{
  const profile = await loadJSON('./data/profile.json')
  const projects = await loadJSON('./data/projects.json') || []
  if(profile){
    el('#name').textContent = profile.name
    el('#title').textContent = profile.title
    el('#bio').textContent = profile.bio
    el('#avatar').src = profile.avatar
    if(profile.email) el('#contact-email').href = 'mailto:'+profile.email
  }
  const highlights = projects.filter(p=>p.highlight)
  const others = projects.filter(p=>!p.highlight)
  const highc = el('#highlights'), otherc = el('#others')
  highlights.forEach(p=> highc.appendChild(renderCard(p,true)))
  others.forEach(p=> otherc.appendChild(renderCard(p,false)))
  const obs = new IntersectionObserver(entries=>{entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible') })},{threshold:0.12})
  document.querySelectorAll('.reveal').forEach(n=>obs.observe(n))
  const tbtn = el('#theme-btn')
  const stored = localStorage.getItem('theme')
  if(stored==='light') document.documentElement.classList.add('light')
  tbtn.addEventListener('click', ()=>{document.documentElement.classList.toggle('light'); localStorage.setItem('theme', document.documentElement.classList.contains('light')?'light':'dark')})
})
function renderCard(p, large){
  const a = create('article','card hover-zoom reveal')
  if(p.image){
    const img = create('img'); img.src = p.image; img.alt = p.name; a.appendChild(img)
  }
  const h = create('h3'); h.textContent = p.name; h.style.margin='0'; a.appendChild(h)
  const d = create('p'); d.className='muted'; d.textContent = p.description; a.appendChild(d)
  const tags = create('div','tags'); tags.innerHTML = (p.technologies||[]).map(t=>`<span class="tag">${t}</span>`).join('')
  a.appendChild(tags)
  const act = create('div','actions')
  const repo = create('a'); repo.href = p.repo; repo.textContent = 'Ver Repo'; repo.className='btn'; repo.target='_blank'
  act.appendChild(repo)
  if(p.demo){const demo = create('a'); demo.href=p.demo; demo.textContent='Demo'; demo.className='btn'; demo.style.background='transparent'; demo.style.border='1px solid rgba(255,255,255,0.06)'; demo.target='_blank'; act.appendChild(demo)}
  a.appendChild(act)
  return a
}

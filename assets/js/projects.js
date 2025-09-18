document.addEventListener('DOMContentLoaded', async () => {
  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
  }

  const profile = await loadJSON('/data/profile.json');
  const projects = await loadJSON('/data/projects.json') || [];

  const header = document.getElementById('profile-header');
  if (profile && header) {
    header.innerHTML = `
      <img src="${profile.avatar}" alt="avatar" class="w-28 h-28 rounded-full border p-1 mr-6 object-cover">
      <div>
        <h1 class="text-3xl font-extrabold">${profile.name}</h1>
        <p class="text-sm text-gray-600">${profile.title}</p>
        <p class="mt-3 text-gray-700 max-w-xl">${profile.bio}</p>
        <div class="mt-4 space-x-3">
          ${profile.email ? `<a href="mailto:${profile.email}" class="text-sm underline">Contactar</a>` : ''}
          ${profile.linkedin ? `<a href="${profile.linkedin}" target="_blank" class="text-sm underline">LinkedIn</a>` : ''}
          ${profile.github ? `<a href="${profile.github}" target="_blank" class="text-sm underline">GitHub</a>` : ''}
        </div>
      </div>
    `;
  }

  function makeTags(tags) {
    return (tags||[]).map(t => `<span class="px-2 py-1 text-xs bg-gray-100 border rounded-full">${t}</span>`).join('');
  }

  function renderCard(p, highlight=false) {
    return `
      <article class="${highlight ? 'p-6 rounded-2xl shadow-lg bg-gradient-to-br from-purple-50 to-white border' : 'p-4 rounded-xl shadow-md bg-white border'}">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" class="mb-3 rounded-lg w-full h-40 object-cover">` : ''}
        <h3 class="text-xl font-bold mb-2">
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="hover:underline">${p.name}</a>
        </h3>
        <p class="text-sm text-gray-600 mb-3">${p.description}</p>
        <div class="flex flex-wrap gap-2 mb-3">${makeTags(p.tags)}</div>
        <div class="flex gap-3">
          <a href="${p.url}" target="_blank" class="px-3 py-1 bg-black text-white rounded-lg text-sm">Ver Repo</a>
          ${p.demo ? `<a href="${p.demo}" target="_blank" class="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">Demo</a>` : ''}
        </div>
      </article>
    `;
  }

  const highlightsContainer = document.getElementById('projects-highlights');
  const othersContainer = document.getElementById('projects-others');
  highlightsContainer.innerHTML = projects.filter(p=>p.highlight).map(p=>renderCard(p,true)).join('');
  othersContainer.innerHTML = projects.filter(p=>!p.highlight).map(p=>renderCard(p,false)).join('');
});

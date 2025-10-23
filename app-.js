const breedSelect = document.getElementById('breedSelect');
const grid = document.getElementById('grid');
const loadBtn = document.getElementById('loadBtn');
const randomBtn = document.getElementById('randomBtn');
const spinner = document.getElementById('spinner');
const status = document.getElementById('status');
const countInput = document.getElementById('count');

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error: ' + res.status);
  return res.json();
}

function setLoading(on, text = '') {
  spinner.style.display = on ? 'block' : 'none';
  loadBtn.disabled = on;
  randomBtn.disabled = on;
  status.textContent = text;
}

async function loadBreeds() {
  try {
    const data = await fetchJSON('https://dog.ceo/api/breeds/list/all');
    const breeds = data.message || {};
    const options = ['<option value=\"\">-- Todas las razas --</option>'];
    for (const [breed, subs] of Object.entries(breeds)) {
      if (subs && subs.length) {
        subs.forEach(sub => options.push(`<option value=\"${breed}/${sub}\">${capitalize(sub)} ${capitalize(breed)}</option>`));
      } else {
        options.push(`<option value=\"${breed}\">${capitalize(breed)}</option>`);
      }
    }
    breedSelect.innerHTML = options.join('');
  } catch {
    breedSelect.innerHTML = '<option value=\"\">Error al cargar</option>';
    status.textContent = 'No se pudieron cargar las razas.';
  }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function clearGrid() { grid.innerHTML = ''; }

function renderImages(urls) {
  clearGrid();
  if (!urls || urls.length === 0) {
    grid.innerHTML = '<div class=\"status\">No hay imágenes.</div>';
    return;
  }
  const frag = document.createDocumentFragment();
  urls.forEach(url => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class=\"imgwrap\">
        <a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">
          <img loading=\"lazy\" src=\"${url}\" alt=\"Imagen de perrito\" />
        </a>
      </div>
      <div class=\"meta\">
        <div>${extractBreedFromUrl(url)}</div>
        <button class=\"smallbtn\" data-url=\"${url}\">📋</button>
      </div>`;
    card.querySelector('[data-url]').addEventListener('click', async e => {
      try {
        await navigator.clipboard.writeText(e.target.dataset.url);
        e.target.textContent = '✓';
        setTimeout(() => e.target.textContent = '📋', 1200);
      } catch {
        alert('No se pudo copiar.');
      }
    });
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

function extractBreedFromUrl(url) {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    const idx = parts.indexOf('breeds');
    if (idx >= 0 && parts[idx + 1]) {
      const raw = parts[idx + 1].replace('-', ' ');
      return raw.split(' ').map(capitalize).join(' ');
    }
  } catch {}
  return 'Desconocido';
}

async function loadImages() {
  const count = Math.min(Math.max(1, parseInt(countInput.value || 8)), 30);
  const breedVal = breedSelect.value.trim();
  setLoading(true, 'Cargando imágenes...');
  try {
    const apiUrl = breedVal
      ? `https://dog.ceo/api/breed/${breedVal}/images/random/${count}`
      : `https://dog.ceo/api/breeds/image/random/${count}`;
    const data = await fetchJSON(apiUrl);
    const images = Array.isArray(data.message) ? data.message : [data.message];
    renderImages(images);
    setLoading(false, `Mostrando ${images.length} imágenes`);
  } catch {
    setLoading(false, 'Error al obtener imágenes.');
  }
}

async function randomDog() {
  setLoading(true, 'Buscando perritos...');
  try {
    const data = await fetchJSON('https://dog.ceo/api/breeds/image/random/6');
    renderImages(data.message);
    setLoading(false, 'Perritos aleatorios');
  } catch {
    setLoading(false, 'Error al cargar aleatorios.');
  }
}

loadBtn.addEventListener('click', loadImages);
randomBtn.addEventListener('click', randomDog);

(async function init() {
  await loadBreeds();
  loadImages();
})();

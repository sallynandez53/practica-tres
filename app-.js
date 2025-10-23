const dogImage = document.getElementById('dogImage');
const fetchDog = document.getElementById('fetchDog');

async function getDogImage() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();
    dogImage.src = data.message;
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
  }
}

fetchDog.addEventListener('click', getDogImage);

// Cargar una imagen al inicio
getDogImage();
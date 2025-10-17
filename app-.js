document.getElementById("botonBuscar").addEventListener("click", buscarPokemon);

async function buscarPokemon() {
  const nombre = document.getElementById("nombrePokemon").value.toLowerCase().trim();
  const resultado = document.getElementById("resultado");

  if (!nombre) {
    resultado.innerHTML = "<p>Por favor, escribe el nombre de un Pokémon.</p>";
    return;
  }

  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (!respuesta.ok) throw new Error("Pokémon no encontrado");

    const datos = await respuesta.json();

    resultado.innerHTML = `
      <h2>${datos.name.toUpperCase()}</h2>
      <img src="${datos.sprites.front_default}" alt="${datos.name}">
      <p><strong>ID:</strong> ${datos.id}</p>
      <p><strong>Altura:</strong> ${datos.height}</p>
      <p><strong>Peso:</strong> ${datos.weight}</p>
      <p><strong>Tipo:</strong> ${datos.types.map(t => t.type.name).join(", ")}</p>
    `;
  } catch (error) {
    resultado.innerHTML = "<p>No se encontró ese Pokémon</p>";
    console.error(error);
  }
}

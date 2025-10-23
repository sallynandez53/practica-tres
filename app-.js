
const boton = document.getElementById("mostrarPerrito");
const contenedor = document.getElementById("imagenContenedor");


boton.addEventListener("click", () => {
    // Llamamos a la API de perritos
    fetch("https://dog.ceo/api/breeds/image/random")
        .then(respuesta => respuesta.json()) // Convertimos la respuesta a JSON
        .then(data => {
            // Mostramos la imagen dentro del contenedor
            contenedor.innerHTML = `<img src="${data.message}" alt="Perrito adorable">`;
        })
        .catch(error => {
            contenedor.innerHTML = `<p>❌ Ocurrió un error al cargar el perrito.</p>`;
            console.error("Error al obtener el perrito:", error);
        });
});

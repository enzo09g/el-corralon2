const contenedorTitulo = document.getElementById('contenedorTitulo');
const contenedorTabla = document.getElementById('contenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');

const URL = 'json/caños.json';


function traerInfo() {
  fetch(URL)
    .then(Response => Response.json())
    .then(data => {
      console.log(data.titulo);
      cambiarTitulo(data);
      mostrarArticulos(data.objeto)
    })
}

function mostrarArticulos(array) {
  array.forEach(element => {
    cuerpoTabla.innerHTML += `
        <tr>
          <td data-label="Nombre">${element.nombre}</td>
          <td data-label="Precio">${element.precioUnitario} ${element.moneda}</td>
          <td data-label="En Stock">${element.publicado}</td>
        </tr>
        `
  });
}

function cambiarTitulo(array) {
  let titulo = document.createElement('h1');
  titulo.textContent = array.titulo
  contenedorTitulo.appendChild(titulo)
}

document.addEventListener('DOMContentLoaded', () => {
  traerInfo();
})
const contenedorTitulo = document.getElementById('contenedorTitulo');
const contenedorTabla = document.getElementById('contenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');

// const catNombre = localStorage.getItem('catNombre');
// let URL = 'json/' + catNombre + '.json'


function traerInfo(json) {
  fetch(json)
    .then(Response => Response.json())
    .then(data => {
      console.log(data.titulo);
      cambiarTitulo(data);
      mostrarArticulos(data.objeto)
    })
}

function jsonNombre(){
  let catNombre = localStorage.getItem('catNombre');
  let URL = 'json/' + catNombre + '.json'
  return URL;
}

function mostrarOpciones() {
  
}

function mostrarArticulos(array) {
  cuerpoTabla.innerHTML = ''
  array.forEach(element => {
    cuerpoTabla.innerHTML += `
        <tr data-descripcion="${element.tipo}" class="fila-producto">
          <td class="tabla-nombre" data-label="Nombre">${element.nombre}</td>
          <td data-label="Precio">$ ${parseInt((element.precioUnitario * 38))}</td>
          <td data-label="En Stock">${element.publicado}</td>
        </tr>
        `
  });
}

function cambiarTitulo(array) {
  let titulo = document.getElementById('titulo');
  titulo.textContent = array.titulo.toUpperCase();
}

function buscar() {
  let buscador = document.getElementById('buscador');
  let productos = Array.from(document.getElementsByClassName('fila-producto'));
  console.log(productos)
  productos.forEach(element => {
    if (!(element.outerHTML.toLowerCase().includes(buscador.value.toLowerCase()))) {
      element.style.display = "none";
    }
    else {
      element.style.display = "table-row"
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  traerInfo(jsonNombre());
  let buscador = document.getElementById('buscador');
  let selector = document.getElementById('selector');
  buscador.addEventListener('keyup', () => {
    buscar();
  })
  selector.addEventListener('change', (event) => {
    localStorage.setItem('catNombre', event.target.value)
    traerInfo(jsonNombre());
  })
})
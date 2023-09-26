const contenedorTitulo = document.getElementById('contenedorTitulo');
const contenedorTabla = document.getElementById('contenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');

const catNombre = localStorage.getItem('catNombre');
let URL = 'json/' + catNombre + '.json'


function traerInfo(jsonURL) {
  fetch(jsonURL)
    .then(Response => Response.json())
    .then(data => {
      console.log(data.titulo);
      cambiarTitulo(data);
      mostrarArticulos(data.objeto)
    })
}

function mostrarArticulos(array) {
  cuerpoTabla.innerHTML = ''
  array.forEach(element => {
    cuerpoTabla.innerHTML += `
        <tr data-descripcion="${element.tipo}" class="fila-producto">
          <td data-label="Nombre">${element.nombre}</td>
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

function buscar(){
  let buscador = document.getElementById('buscador');
  let productos = Array.from(document.getElementsByClassName('fila-producto'));
  console.log(productos)
  productos.forEach(element => {
    if(!(element.outerHTML.toLocaleLowerCase().includes(buscador.value.toLocaleLowerCase()))){
      element.style.display = "none";
    }
    else{
      element.style.display = "table-row"
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  traerInfo(URL);
  let buscador = document.getElementById('buscador');
  let selector = document.getElementById('selector');
  buscador.addEventListener('keyup', () =>{
    buscar();
  })
  selector.addEventListener('change', (event) =>{
    URL = 'json/' + event.target.value + '.json'
    traerInfo(URL)
  })
})
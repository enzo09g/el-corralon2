const contenedorTitulo = document.getElementById('contenedorTitulo');
const contenedorTabla = document.getElementById('contenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');
let tipos = [];

let arrayProductos;

function traerInfo(json) {
  fetch(json)
    .then(Response => Response.json())
    .then(data => {
      console.log(data.titulo);
      cambiarTitulo(data);
      mostrarArticulos(data.objeto)
      cantidadTipos(data.objeto)
      mostrarOpciones()
    })
}

function fetchData(json) {
  fetch(json)
    .then(response => response.json())
    .then(data => {
      arrayProductos = data;
    })
}

function jsonNombre() {
  let catNombre = localStorage.getItem('catNombre');
  let URL = 'json/' + catNombre + '.json'
  return URL;
}

function cantidadTipos(array) {
  tipos = [];

  for (let i of array) {
    if (i.tipo) {
      if (!(tipos.includes(i.tipo))) {
        tipos.push(i.tipo);
      }
    }
  }
}

function mostrarOpciones() {
  let selector = document.getElementById('selector-filtro');
  selector.innerHTML = "";

  let opcionDisable = document.createElement('option');
  opcionDisable.value = "";
  opcionDisable.selected = true;
  opcionDisable.textContent = "Seleccione una categoria"
  opcionDisable.setAttribute("disabled", "disabled");
  selector.appendChild(opcionDisable);
  if (tipos.length > 0) {
    for (let i of tipos) {
      let opcion = document.createElement('option');
      opcion.value = i.toLowerCase();
      opcion.textContent = i.toUpperCase();
      selector.appendChild(opcion)
    }
  }
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
  fetchData(jsonNombre());
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

  selectorFiltro = document.getElementById('selector-filtro');
  selectorFiltro.addEventListener('change', (event) => {
    
    let arrayChange = Array.from(arrayProductos.objeto)
    let arrayFiltro = [];
    let filtro = event.target.value;

    arrayChange.forEach(element =>{
      if(element.tipo.toLowerCase() === filtro){
        arrayFiltro.push(element);
      }
    })

    mostrarArticulos(arrayFiltro)
  })
})
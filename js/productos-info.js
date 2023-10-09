// Obtener referencias a elementos del DOM por su ID
const contenedorTitulo = document.getElementById('contenedorTitulo');
const contenedorTabla = document.getElementById('contenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');

// Declarar un arreglo vacío para almacenar tipos de productos
let tipos = [];

// Esta variable tendra la info del fetch traerInfo()
let arrayProductos;

function traerInfo(json) {
  fetch(json)
    .then(Response => Response.json())
    .then(data => {
      console.log(data.titulo);
      cambiarTitulo(data);
      mostrarArticulos(data.objeto)
      actualizarTipos(data.objeto)
      actualizarOpciones()
      fetchData(jsonNombre())
      preFiltro()
    })
}

function fetchData(json) {   //Actualiza arrayProductos
  fetch(json)
    .then(response => response.json())
    .then(data => {
      arrayProductos = data;
    })
}

function jsonNombre() {   // Retorna el nombre del JSON del local storage
  let catNombre = localStorage.getItem('catNombre');
  let URL = 'json/' + catNombre + '.json'
  return URL;
}

function actualizarTipos(array) {
  tipos = [];

  for (let i of array) {
    if (i.tipo) {
      if (!(tipos.includes(i.tipo))) {
        tipos.push(i.tipo);
      }
    }
  }
}

function actualizarOpciones() {
  let selector = document.getElementById('selector-filtro');
  selector.innerHTML = "";

  let opcionDisable = document.createElement('option');
  opcionDisable.value = "";
  opcionDisable.selected = true;
  opcionDisable.textContent = "TIPO"
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

function preFiltro() {
  let selector = document.getElementById('selector-filtro');
  let selectOpcion = localStorage.getItem('tipoNombre');

  for (let i = 0; i < tipos.length; i++) {
    if (selectOpcion == tipos[i].toLowerCase()) {
      var event = new Event("change", { bubbles: true });
      selector.selectedIndex = (i+1);
      selector.dispatchEvent(event)
    }
  }
}

// Se puede mejorar
function limpiarFIltros(){  
  localStorage.removeItem('tipoNombre')                    
  let buscador = document.getElementById('buscador');
  let selector = document.getElementById('selector-filtro');
  if(selector.selectedIndex != 0){
    traerInfo(jsonNombre())
  }
  if(buscador.value != ""){
    console.log("hola")
    let event = new Event('keyup', {bubbles: true});
    buscador.value = "";
    buscador.dispatchEvent(event);
  }
  // let event = new Event('change', {bubbles : true});
  // selector.selectedIndex = 0;
  // selector.dispatchEvent(event);
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

  fetchData(jsonNombre());    // Se usa aqui fetchData para actualizar arrayDatos, ya que el fetch de fetchData dentro de traerInfo no llega a completarse correctamente(dentro de otras funciones en general)
  traerInfo(jsonNombre());
  let buscador = document.getElementById('buscador');
  let selector = document.getElementById('selector');

  buscador.addEventListener('keyup', () => {
    buscar();
  })

  selector.addEventListener('change', (event) => {
    localStorage.setItem('catNombre', event.target.value)
    localStorage.removeItem('tipoNombre');
    traerInfo(jsonNombre());
  })

  selectorFiltro = document.getElementById('selector-filtro');
  selectorFiltro.addEventListener('change', (event) => {

    let arrayChange = Array.from(arrayProductos.objeto)
    let filtro = selectorFiltro.value.toLowerCase();
    let arrayFiltro = arrayChange.filter(element => element.tipo.toLowerCase() === filtro);

    mostrarArticulos(arrayFiltro)
  })

  let btnQuitarFiltro = document.getElementById('btn-quitar-filtro');
  btnQuitarFiltro.addEventListener('click', () =>{
    limpiarFIltros();
  })
  
})
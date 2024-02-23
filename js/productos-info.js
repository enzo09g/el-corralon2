// Obtener referencias a elementos del DOM por su ID
const contenedorTitulo = document.getElementById('contenedorTitulo');
const contenedorTabla = document.getElementById('contenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');

// Declarar un arreglo vacío para almacenar tipos de productos
let tipos = [];

// Esta variable tendra la info del fetch traerInfo()
let arrayProductos;

async function traerInfo(json) {

  const response = await fetch(json)
  const data = await response.json();
  console.log(data.titulo);
  cambiarTitulo(data);
  mostrarArticulos(data.objeto)
  actualizarTipos(data.objeto)
  actualizarOpciones()
  fetchData(jsonNombre())
  preFiltro()
}

async function fetchData(json) {   //Actualiza arrayProductos

  const response = await fetch(json)
  const data = await response.json();
  arrayProductos = data;

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
      selector.selectedIndex = (i + 1);
      selector.dispatchEvent(event)
    }
  }
}

// Se puede mejorar
function limpiarFIltros() {
  localStorage.removeItem('tipoNombre')
  let buscador = document.getElementById('buscador');
  let selector = document.getElementById('selector-filtro');
  if (selector.selectedIndex != 0) {
    traerInfo(jsonNombre())
  }
  if (buscador.value != "") {
    console.log("hola")
    let event = new Event('keyup', { bubbles: true });
    buscador.value = "";
    buscador.dispatchEvent(event);
  }
  // let event = new Event('change', {bubbles : true});
  // selector.selectedIndex = 0;
  // selector.dispatchEvent(event);
}


function mostrarArticulos(array) {
  cuerpoTabla.innerHTML = ''
  array.forEach((element, index) => {
    cuerpoTabla.innerHTML += `
        <tr data-descripcion="${element.tipo}" class="fila-producto">
          <td class="tabla-nombre" id="${index}" data-label="Nombre">${element.nombre}</td>
          <td data-label="Cantidad">
            <div>
              <input placeholder="Cantidad..." type="number" class="form-control form-control-sm" id="${index}" required>
              <div class="invalid-feedback">
              Ingrese una cantidad.
              </div>
            </div></td>

          <td data-label="Lista de presupuesto"><i class="bi bi-cart3 carrito-vacio" id="${index}" style="font-size: 1.3rem"></i></td>
        </tr>
        `
  });


  const arrayCarrito = Array.from(document.getElementsByTagName('i'));
  añadirEventoCarrito(arrayCarrito)
}

function añadirEventoCarrito(array) {
  array.forEach(element => {
    element.addEventListener('click', () => {
      let indexCantidades = parseInt(element.id) + 1
      const arrayNombres = Array.from(document.getElementsByTagName('td'))
      const arrayCantidades = Array.from(document.getElementsByTagName('input'));

      let nombre = arrayNombres.find(elemento => elemento.id == element.id).innerHTML
      let inputCantidad = arrayCantidades[indexCantidades]
      let cantidad = inputCantidad.value

      if (!cantidad) {
        inputCantidad.classList.contains("is-valid") ? inputCantidad.classList.remove("is-valid") : inputCantidad
        inputCantidad.classList.add('is-invalid')
        element.style="font-size: 1.3rem"
      } else {
        inputCantidad.classList.contains("is-invalid") ? inputCantidad.classList.remove("is-invalid") : inputCantidad
        inputCantidad.classList.add("is-valid")
        element.style = "color: cornflowerblue; font-size: 1.2rem"  
        let producto = {
          "nombre": nombre,
          "cantidad": cantidad
        }
        enviarAlCarrito(producto)
      }

    })
  });
}

function enviarAlCarrito(producto) {
  let array = [];
  array.push(producto)
  console.log(array)
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
  btnQuitarFiltro.addEventListener('click', () => {
    limpiarFIltros();
  })

})
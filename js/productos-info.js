// Obtener referencias a elementos del DOM por su ID
const contenedorTitulo = document.getElementById('contenedorTitulo');
const contenedorTabla = document.getElementById('contenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const carritoDiv = document.querySelector('.logoWhatsapp')
let carritoGlobal = JSON.parse(localStorage.getItem('carrito')) || []

// Declarar un arreglo vacío para almacenar tipos de productos
let tipos = [];

// Esta variable tendra la info del fetch traerInfo()
let arrayProductos;

async function traerInfo(json) {

  const response = await fetch(json)
  const data = await response.json();
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
    let event = new Event('keyup', { bubbles: true });
    buscador.value = "";
    buscador.dispatchEvent(event);
  }
  // let event = new Event('change', {bubbles : true});
  // selector.selectedIndex = 0;
  // selector.dispatchEvent(event);
}

function mostrarLogo() {
  if (carritoGlobal.length >= 1) {
    carritoDiv.classList.contains('d-none') ? carritoDiv.classList.remove('d-none') : carritoDiv
  } else {
    carritoDiv.classList.contains('d-none') ? carritoDiv : carritoDiv.classList.add('d-none')
  }
}

function mostrarArticulos(array) {
  mostrarLogo()
  enviarAlModal() // moverlo a cuando se hace click en el boton del carrito
  cuerpoTabla.innerHTML = ''
  array.forEach((element, index) => {
    if (carritoGlobal.some(item => item.nombre == element.nombre)) {
      let elementoEnCarrito = carritoGlobal.find(elementoCarrito => elementoCarrito.nombre == element.nombre)

      cuerpoTabla.innerHTML += `
      <tr data-descripcion="${element.tipo}" class="fila-producto">
        <td class="tabla-nombre" id="${index}" data-label="Nombre">${element.nombre}</td>
        <td data-label="Cantidad">
          <div>
            <input type="number" data-btnnombre="${element.nombre}" placeholder="Cantidad..." class="form-control form-control-sm is-valid" id="${index}" value="${elementoEnCarrito.cantidad}" required>
            <div class="invalid-feedback">
            Ingrese una cantidad.
            </div>
          </div></td>

        <td data-label="Lista de presupuesto"><i class="bi bi-cart3 carrito-vacio" id="${index}" data-btnnombre="${element.nombre}" style="color: cornflowerblue; font-size: 1.3rem"></i><i data-btnnombre="${element.nombre}" id="${index}" class="bi bi-trash mx-5 borrar" style="font-size: 1.3rem"></i></td>
      </tr>
      `

    } else {
      cuerpoTabla.innerHTML += `
          <tr data-descripcion="${element.tipo}" class="fila-producto">
            <td class="tabla-nombre" id="${index}" data-label="Nombre">${element.nombre}</td>
            <td data-label="Cantidad">
              <div>
                <input type="number" data-btnnombre="${element.nombre}" placeholder="Cantidad..." class="form-control form-control-sm" id="${index}" required">
                <div class="invalid-feedback">
                Ingrese una cantidad.
                </div>
              </div></td>
  
            <td data-label="Lista de presupuesto"><i class="bi bi-cart3 carrito-vacio" id="${index}" data-btnnombre="${element.nombre}" style="font-size: 1.3rem"></i><i id="${index}" data-btnnombre="${element.nombre}" class="bi bi-trash mx-5 borrar d-none" style="font-size: 1.3rem"></i></td>
          </tr>
          `
    }
  });



  const arrayCarrito = Array.from(document.getElementsByClassName('carrito-vacio'));
  const botonBorrar = Array.from(document.getElementsByClassName('borrar'));
  añadirEventoCarrito(arrayCarrito);
  añadirEventoBorrar(botonBorrar);
}

function añadirEventoCarrito(array) {
  array.forEach(element => {
    element.addEventListener('click', () => {
      let indexCantidades = parseInt(element.id) + 1
      const arrayNombres = Array.from(document.getElementsByTagName('td'))
      const arrayCantidades = Array.from(document.getElementsByTagName('input'));
      const botonBorrar = Array.from(document.getElementsByClassName('borrar'))[element.id];

      let nombre = arrayNombres.find(elemento => elemento.id == element.id).innerHTML
      let inputCantidad = arrayCantidades[indexCantidades]
      let cantidad = inputCantidad.value

      if (!cantidad) {
        inputCantidad.classList.contains("is-valid") ? inputCantidad.classList.remove("is-valid") : inputCantidad
        inputCantidad.classList.add('is-invalid')
        element.style = "font-size: 1.3rem"
        botonBorrar.classList.contains('d-none') ? botonBorrar : botonBorrar.classList.add('d-none')
        setTimeout(() => {
          inputCantidad.classList.contains('is-invalid') ? inputCantidad.classList.remove('is-invalid') : inputCantidad
        }, 8000);
      } else {
        inputCantidad.classList.contains("is-invalid") ? inputCantidad.classList.remove("is-invalid") : inputCantidad
        inputCantidad.classList.add("is-valid")
        element.style = "color: cornflowerblue; font-size: 1.3rem"
        botonBorrar.classList.remove('d-none')
        let producto = {
          "nombre": nombre,
          "cantidad": cantidad
        }
        enviarAlCarrito(producto)
        enviarAlModal()
        mostrarLogo()

      }

    })
  });
}

function añadirEventoBorrar(array) {
  array.forEach(element => {
    element.addEventListener('click', () => {
      let indexCantidades = parseInt(element.id) + 1
      const arrayNombres = Array.from(document.getElementsByTagName('td'))
      const arrayCantidades = Array.from(document.getElementsByTagName('input'));
      const arrayCarrito = Array.from(document.getElementsByClassName('carrito-vacio'))
      arrayCarrito[element.id].style = "font-size: 1.3rem"
      let inputCantidad = arrayCantidades[indexCantidades]
      inputCantidad.value = ""
      let nombre = arrayNombres.find(elemento => elemento.id == element.id).innerHTML

      inputCantidad.classList.contains('is-valid') ? inputCantidad.classList.remove('is-valid') : inputCantidad
      inputCantidad.classList.contains('is-invalid') ? inputCantidad.classList.remove('is-invalid') : inputCantidad
      element.classList.add('d-none')

      borrarDelCarrito(nombre)
      enviarAlModal()
      mostrarLogo()

    })
  });
}

function enviarAlCarrito(producto) {
  try {
    let elementoRepetido = carritoGlobal.find(element => element.nombre == producto.nombre);
    let indice = carritoGlobal.indexOf(elementoRepetido);
    if (elementoRepetido) {
      carritoGlobal.splice(indice, 1, producto)
      modificarPrespuesto()
      actualizarCarrito(carritoGlobal)
    } else {
      carritoGlobal.push(producto)
      modificarPrespuesto()
      actualizarCarrito(carritoGlobal)
    }
  } catch (e) {
    localStorage.removeItem('carrito')
  }
}

function actualizarCarrito(array) {
  let carrito = JSON.stringify(array);
  localStorage.setItem('carrito', carrito)
}

function borrarDelCarrito(nombre) {
  console.log(nombre)
    let index = carritoGlobal.findIndex(element => element.nombre == nombre);
    console.log(index)
    carritoGlobal.splice(index, 1)
    modificarPrespuesto()
    actualizarCarrito(carritoGlobal)
}


async function enviarAlModal() {
  const contenedorModal = document.getElementById('contenedor-modal');
  contenedorModal.innerHTML = "";

  carritoGlobal.forEach((element, index) => {
    const productoModal = crearProductoModal(element, index);
    contenedorModal.appendChild(productoModal)
  });

  const elementosI = await getElementosIModal();
  agregarEventoEliminar(elementosI);
}

function agregarEventoEliminar(array) {
  array.forEach((element) => {
    element.addEventListener('click', (event) => {
      let padre = element.parentNode
      let nombre = padre.firstChild.dataset.nombre
      
      borrarDelCarrito(nombre)
      enviarAlModal()
      quitarBtnEliminar(nombre)
      mostrarLogo()
    })
  });
}

function quitarBtnEliminar(nombre){
  const array = Array.from(document.getElementsByClassName('borrar'));
  const arrayCarrito = Array.from(document.getElementsByClassName('carrito-vacio'));
  const arrayInput = Array.from(document.getElementsByClassName('is-valid'))
  console.log(arrayInput)
  let btnBorrar = array.find(element => element.dataset.btnnombre == nombre)
  let btnComprar = arrayCarrito.find(element => element.dataset.btnnombre == nombre)
  let input = arrayInput.find(element => element.dataset.btnnombre == nombre)
  console.log(input)
  btnBorrar.classList.add('d-none')
  btnComprar.style = "font-size: 1.3rem"
  input.value = "";
  input.classList.remove('is-valid');
}

function getElementosIModal() {
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      const arrayI = Array.from(document.getElementsByClassName('producto-modal-btnEliminar'));
      if (arrayI.length == carritoGlobal.length) {
        clearInterval(interval)
        resolve(arrayI)
      }
    }, 200);
  })
}

function crearProductoModal(producto, index) {
  const div = document.createElement('div');
  div.className = "row my-2 producto-modal fs-6"

  div.innerHTML =
    `<div class="col-6 d-flex align-items-center" data-nombre="${producto.nombre}">${producto.nombre}</div>
     <div class="col-4 d-flex align-items-center"><input class="form-control" type="number" value="${producto.cantidad}"></div>
     <div class="col-2 d-flex justify-content-center producto-modal-btnEliminar"><i id="${index}" class="bi bi-x fs-2 producto-modal-eliminar"></i></div>
  `


  return div;
}


function modificarPrespuesto() {
  let mensaje = carritoGlobal.map(objeto => `${objeto.cantidad} ${objeto.nombre} `).join('; ');
  let mensajeCodificado = encodeURIComponent(mensaje);
  let link = document.getElementById('link')
  link.href = `https://wa.me/59892731026?text=${mensajeCodificado}`
}

function mostrarCarritoDelLocal() {
  carrito = JSON.parse(localStorage.getItem('carrito'));
  console.log(carrito);
}


function cambiarTitulo(array) {
  let titulo = document.getElementById('titulo');
  titulo.textContent = array.titulo.toUpperCase();
}

function buscar() {
  let buscador = document.getElementById('buscador');
  let productos = Array.from(document.getElementsByClassName('fila-producto'));
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
  modificarPrespuesto()

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
// Obtener referencias a elementos del DOM por su ID
const contenedorTitulo = document.getElementById('contenedorTitulo');
const contenedorTabla = document.getElementById('contenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const carritoDiv = document.querySelector('.logoWhatsapp')
let carritoGlobal = JSON.parse(localStorage.getItem('carrito')) || []
let linkGlobal;

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

const obtenerSelector = () => {
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      const selector = document.getElementById('selector-filtro')
      if (selector.options.length == 7) {
        clearInterval(interval)
        resolve(selector)
      }
    }, 500);
  })
}

async function preFiltro() {
  const selector = await obtenerSelector()
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
  const btnWppModal = document.getElementById('wpButton');
  const menuCarrito = document.querySelector('.carrito-menu');
  if (carritoGlobal.length >= 1) {
    menuCarrito.classList.add('carrito-con-productos');
    btnWppModal.removeAttribute('disabled')

    carritoDiv.classList.contains('d-none') ? carritoDiv.classList.remove('d-none') : carritoDiv
  } else {
    menuCarrito.classList.remove('carrito-con-productos');
    carritoDiv.classList.contains('d-none') ? carritoDiv : carritoDiv.classList.add('d-none')
    btnWppModal.setAttribute('disabled', "")
  }
}

function añadirEventoBtnModal() {
  const btnWppModal = document.getElementById('wpButton');
  btnWppModal.addEventListener('click', () => {
    // window.location.href = linkGlobal
    window.open(linkGlobal, '_blank');
  })
}

function mostrarArticulos(array) {
  mostrarLogo()
  cuerpoTabla.innerHTML = ''
  array.forEach((element, index) => {
    if (carritoGlobal.some(item => item.nombre == element.nombre)) {
      let elementoEnCarrito = carritoGlobal.find(elementoCarrito => elementoCarrito.nombre == element.nombre)

      cuerpoTabla.innerHTML += `
      <tr data-descripcion="${element.tipo}" class="fila-producto">
        <td class="tabla-nombre" id="${index}" data-label="Nombre">${element.nombre}</td>
        <td data-label="Cantidad">
          <div>
            <input min="1" type="number" data-btnnombre="${element.nombre}" placeholder="Cantidad..." class="form-control form-control-sm is-valid" id="${index}" value="${elementoEnCarrito.cantidad}" required>
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
                <input min="1" type="number" data-btnnombre="${element.nombre}" placeholder="Cantidad..." class="form-control form-control-sm" id="${index}" required">
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

      if (!cantidad || cantidad < 1) {
        let elementoRepetido = carritoGlobal.find(element => element.nombre == nombre)
        let indice = carritoGlobal.indexOf(elementoRepetido);
        if (elementoRepetido) {
          carritoGlobal.splice(indice, 1)
          modificarPrespuesto()
          actualizarCarrito(carritoGlobal)
          enviarAlModal("añadirEventoCarrito")
          mostrarLogo()
        }
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
        enviarAlModal("añadirEventoCarrito")
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
      enviarAlModal("añadirEventoBorrar")
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
  let index = carritoGlobal.findIndex(element => element.nombre == nombre);
  console.log(index)
  carritoGlobal.splice(index, 1)
  modificarPrespuesto()
  actualizarCarrito(carritoGlobal)
}

const vaciarContenedor = (contenedor) => {
  while (contenedor.firstChild) {
    let hijo = contenedor.firstChild;
    contenedor.removeChild(hijo)
  }
}

async function enviarAlModal() {
  const contenedorModal = document.getElementById('contenedor-modal');
  vaciarContenedor(contenedorModal);
  // contenedorModal.innerHTML = "";

  carritoGlobal.forEach((element, index) => {
    const productoModal = crearProductoModal(element, index);
    contenedorModal.appendChild(productoModal)
  });

  const elementosI = await getElementosIModal();
  agregarEventoEliminar(elementosI);
  agregarEventoInput()
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

function agregarEventoInput() {
  const arrayInput = Array.from(document.getElementsByClassName('inputModal'));
  arrayInput.forEach(element => {
    element.addEventListener('input', () => {
      let nombre = element.dataset.nombre
      let cantidad = element.value
      let producto = {
        "nombre": nombre,
        "cantidad": cantidad
      }
      enviarAlCarrito(producto)
      const arrayInput = Array.from(document.getElementsByClassName('is-valid'))
      let input = arrayInput.find(element => element.dataset.btnnombre == nombre)
      if (input) {
        input.value = cantidad;
      }
    })
  });
}

function quitarBtnEliminar(nombre) {
  const array = Array.from(document.getElementsByClassName('borrar'));
  const arrayCarrito = Array.from(document.getElementsByClassName('carrito-vacio'));
  const arrayInput = Array.from(document.getElementsByClassName('is-valid'))
  let btnBorrar = array.find(element => element.dataset.btnnombre == nombre)
  let btnComprar = arrayCarrito.find(element => element.dataset.btnnombre == nombre)
  let input = arrayInput.find(element => element.dataset.btnnombre == nombre)

  if (btnBorrar) {
    btnBorrar.classList.add('d-none')
  }

  if (btnComprar) {
    btnComprar.style = "font-size: 1.3rem"
  }

  if (input) {
    input.value = "";
    input.classList.remove('is-valid');
  }
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
     <div class="col-4 d-flex align-items-center"><input data-nombre="${producto.nombre}" min="1" class="form-control inputModal" type="number" value="${producto.cantidad}"></div>
     <div class="col-2 d-flex justify-content-center producto-modal-btnEliminar"><i id="${index}" class="bi bi-x fs-2 producto-modal-eliminar"></i></div>
  `


  return div;
}


function modificarPrespuesto() {
  let mensaje = carritoGlobal.map(objeto => `${objeto.cantidad} ${objeto.nombre} `).join('; ');
  let mensajeCodificado = encodeURIComponent(mensaje);
  let link = document.getElementById('link')
  linkGlobal = `https://wa.me/59892731026?text=${mensajeCodificado}`
  link.href = linkGlobal
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
  añadirEventoBtnModal()
  fetchData(jsonNombre());    // Se usa aqui fetchData para actualizar arrayDatos, ya que el fetch de fetchData dentro de traerInfo no llega a completarse correctamente(dentro de otras funciones en general)
  traerInfo(jsonNombre());
  enviarAlModal()
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
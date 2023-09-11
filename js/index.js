document.addEventListener("DOMContentLoaded", () => {
  let botonNosotros = document.getElementById("nosotros");
  let botonProductos = document.getElementById("productos");
  let botonContacto = document.getElementById("contacto");

  botonContacto.addEventListener("click", () => {
    trasladerse(botonContacto.id)
  });

  botonNosotros.addEventListener("click", () => {
    trasladerse(botonNosotros.id)
  });

  botonProductos.addEventListener("click", () => {
    trasladerse(botonProductos.id)
  });
});

function trasladerse(nombre) {
  window.location = nombre + '.html';
}

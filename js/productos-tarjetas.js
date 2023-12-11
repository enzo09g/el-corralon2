$(document).ready(function () {
  var zindex = 10;

  $("div.tarjeta").click(function (e) {
    e.preventDefault();

    var isShowing = false;

    if ($(this).hasClass("show")) {
      isShowing = true
    }

    if ($("div.tarjetas").hasClass("showing")) {
      // a tarjeta is already in view
      $("div.tarjeta.show")
        .removeClass("show");

      if (isShowing) {
        // this tarjeta was showing - reset the grid
        $("div.tarjetas")
          .removeClass("showing");
      } else {
        // this tarjeta isn't showing - get in with it
        $(this)
          .css({ zIndex: zindex })
          .addClass("show");

      }

      zindex++;

    } else {
      // no tarjetas in view
      $("div.tarjetas")
        .addClass("showing");
      $(this)
        .css({ zIndex: zindex })
        .addClass("show");

      zindex++;
    }
  });

  $("a.ir").click(function (e) {
    e.stopPropagation(); // Evita que el evento de tarjeta se active al hacer clic en el botón "Read more"
    var url = $(this).closest(".tarjeta").data("url"); // Obtiene la URL de la tarjeta actual
    var catNombre = $(this).closest(".tarjeta").data("catnombre"); // Obtiene el valor de data-catNombre
    localStorage.setItem('tipoNombre', "none");

    if (catNombre) {
      // Guarda el valor de data-catNombre en el almacenamiento local
      localStorage.setItem("catNombre", catNombre);
    }

    if (url) {
      window.location.href = url; // Redirige a la URL correspondiente
    }
  });
});


// Codigo JS



function trasladarse(event){
  let dataValue = event.target.getAttribute("data-tipo");
  let dataNombre = event.target.getAttribute("data-catNombre")
  console.log(dataValue)
  localStorage.setItem('catNombre', dataNombre)
  localStorage.setItem('tipoNombre', dataValue);
  window.location = "productos-info.html";
}
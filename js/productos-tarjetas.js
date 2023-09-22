$(document).ready(function(){
    var zindex = 10;
    
    $("div.card").click(function(e){
      e.preventDefault();
  
      var isShowing = false;
  
      if ($(this).hasClass("show")) {
        isShowing = true
      }
  
      if ($("div.cards").hasClass("showing")) {
        // a card is already in view
        $("div.card.show")
          .removeClass("show");
  
        if (isShowing) {
          // this card was showing - reset the grid
          $("div.cards")
            .removeClass("showing");
        } else {
          // this card isn't showing - get in with it
          $(this)
            .css({zIndex: zindex})
            .addClass("show");
  
        }
  
        zindex++;
  
      } else {
        // no cards in view
        $("div.cards")
          .addClass("showing");
        $(this)
          .css({zIndex:zindex})
          .addClass("show");
  
        zindex++;
      }
    });
      
      $("a.ir").click(function(e) {
        e.stopPropagation(); // Evita que el evento de tarjeta se active al hacer clic en el botón "Read more"
        var url = $(this).closest(".card").data("url"); // Obtiene la URL de la tarjeta actual
        if (url) {
            window.location.href = url; // Redirige a la URL correspondiente
        }
    });
});


// Codigo JS


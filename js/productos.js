document.addEventListener('DOMContentLoaded', () => {
    let buscador = document.getElementById('buscador')
    buscador.addEventListener('keyup', () =>{
        buscar(buscador)
    });

})

function buscar(buscador) {
    let tarjetas = Array.from(document.getElementsByClassName('card'));

    tarjetas.forEach(element => {
        if (!(element.textContent.toLowerCase().includes(buscador.value.toLowerCase()))) {
            element.style.display = 'none'
        } else {
            element.style.display = 'inline-block'
        }
    });
}

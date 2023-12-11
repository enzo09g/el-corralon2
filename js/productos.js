document.addEventListener('DOMContentLoaded', () => {
    let buscador = document.getElementById('buscador')
    buscador.addEventListener('keyup', () => {
        buscar(buscador)
    });
    loader();

})

function loader(){
    let contLoad = document.getElementById('contLoad');
    contLoad.style = "display: none"
}

function buscar(buscador) {
    let tarjetas = Array.from(document.getElementsByClassName('tarjeta'));

    tarjetas.forEach(element => {
        if (!(element.textContent.toLowerCase().includes(buscador.value.toLowerCase()))) {
            element.style.display = 'none'
        } else {
            element.style.display = 'inline-block'
        }
    });
}


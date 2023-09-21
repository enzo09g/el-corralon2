const contenedorTitulo = document.getElementById('contenedorTitulo');
const contenedorTabla = document.getElementById('contenedor');

const URL = 'json/caños.json'; 


function traerInfo(){
    fetch('json/caños.json')
    .then(Response => Response.json())
    .then(data =>{
        console.log(data.titulo);
        cambiarTitulo(data);
    })
}

function cambiarTitulo(array){
    let titulo = document.createElement('h1');
    titulo.textContent = array.titulo
    contenedorTitulo.appendChild(titulo)
}

document.addEventListener('DOMContentLoaded', () => {
    traerInfo();
})
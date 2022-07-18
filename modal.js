//modal es una clase que tengo en html
const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]


const botonAbrir = document.getElementById('boton-carrito')
const botonCerrar = document.getElementById('carritoCerrar')


const modalCarrito = document.getElementsByClassName('modal-carrito')[0]



/*********AMBOS EVENTOS CLIC REALIZAN LA MISMA TAREA - AGREGAR Y QUITAR EL NOMBRE DE CLASE 'modal-active *********/
botonAbrir.addEventListener('click', ()=>{
    //classList.toggle sirve para agregar y quitar una clase
    //es como colocar classList.add('modal-active') y tambien colocar classList.remove('modal-active') al mismo tiempo
    //es decir, al hacer un clic le agregara esa clase, y al volver a hacerle un clic se la quitara
    //esto me sirve para que el css realice su funcion con ese nombre de clase
    contenedorModal.classList.toggle('modal-active')
})


botonCerrar.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active')
})
//con esto al presionar el carrito se abre el modal y al presionar la cruz del modal este se cierra
//pero si hago clic por fuera del modal, no pasa nada

/*************************************************************************************************************/




//de la siguiente forma cuando se abra el modal si hago clic por fuera en cualquier parte de la pantalla
//el modal se cerrara
contenedorModal.addEventListener('click', () => {
    botonCerrar.click() //simulo el evento clic en el boton cerrar, que va a ejecutar el toggle
})


/*si le hago un clic al modal en cualquier parte este se cierra
para que no pase eso, debemos evitar que se propague el evento clic a sus padre contenedores por el efecto de cascada
para eso utilizamos el stopPropagation */
modalCarrito.addEventListener('click', (event) => {
    event.stopPropagation()
})







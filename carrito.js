const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("carrito-contenedor");
const botonVaciar = document.getElementById("vaciar-carrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const precioTotall = document.getElementById("precioTotal");
const botonProcesarCompra = document.getElementById("procesar-carrito");

let usuariocompra = localStorage.getItem("user");



/******************************************************************************************** */

//PASO 1: Cargo el localstorage Carrito con un array vacio para ir haciendole push en el futuro:
let carritoo = [];


let carritovacio = true;

/************************************************************************************************/



/********************************************************************************************************** */

//DECLARACION DE TODAS LAS FUNCIONES QUE CONTIENE EL SISTEMA

/********************************************************************************************************* */


/****************************************************************************************************** */
//                              INICIO FUNCION MOSTRAR PRODUCTOS DEL STOCK EN PANTALLA
/***************************************************************************************************** */

/*const traerDatos = async() => {
  try{
    const result = await fetch('stockTienda.json');
    const data = await result.json();
    return data;
  }catch(error){
    console.log(error);
  }
}
const listaProducto =traerDatos();
console.log(listaProducto);*/
//listaProducto.forEach(el=>console.log(el));
//for(const file of listaProducto){}

//ESTA FUNCION LA UTILIZO PARA MOSTRAR LOS PRODUCTOS DE LA TIENDA EN PANTALLA
const mostrarProductos = () => {

  
  fetch('stockTienda.json')
    .then(respuesta => respuesta.json())
    .then(productos => {


      contenedorProductos.innerHTML = "";
      productos.forEach(producto => {

        const div = document.createElement('div')
        div.classList.add('producto')
        div.innerHTML = `
  <img src=${producto.img} alt="">
  <h3>${producto.nombre}<h3>
  <p>${producto.desc}</p>
  <p class="precioProducto">Precio: $${producto.precio}</p>
  <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
  `

        contenedorProductos.appendChild(div)

        const boton = document.getElementById(`agregar${producto.id}`)


        //AL PRESIONAR EL BOTON AGREGAR BUSCO SI EXITE EL PRODUCTO
        boton.addEventListener('click', () => {
          usuariocompra = localStorage.getItem("user");

          if (usuariocompra) {

            const item = carritoo.find((prod) => prod.id === producto.id)


            if (!item) {
              console.log("HOLA1")
              //SI NO EXISTE EL PRODUCTO LO AGREGO AL CARRITO
              agregarAlcarrito(producto.id)

            } else {
              //SI EXISTE EL PRODUCTO LE SUMO LA PROPIEDAD CANTIDAD DEL PRODUCTO SELECCIONADO
              carritoo.forEach(prodCarrito => {
                if (prodCarrito.id === producto.id) {
                  console.log("HOLA2")
                  prodCarrito.cantvend = prodCarrito.cantvend + 1;
                  prodCarrito.cantdep = prodCarrito.cantdep - 1;
                  localStorage.setItem("Carrito", JSON.stringify(carritoo));

                  actualizarCarritoo();

                  Swal.fire({
                    position: 'center-center',
                    icon: 'success',
                    title: 'El producto fue agregado al carrito!',
                    showConfirmButton: false,
                    timer: 1500
                  })

                }
              })



            }

          } else {

            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Debe Identificarse para agregar al carrito!',


            })

          }
        })


      });



    })

  //SI EXISTE EL USUARIO LO MUESTRO EN PANTALLA
  if (localStorage.getItem("user")) {
    let usuario = localStorage.getItem("user");
    let mensajePadre = document.getElementById("mensajeLogin");

    mensajePadre.innerHTML = "";

    const mensaje = document.createElement("div");
    mensaje.innerHTML = `usuario: ${usuario}`;
    mensajePadre.append(mensaje);

    document.querySelector("#idUsuario").value = "";
    document.querySelector("#idContrasenia").value = "";


  }

  //SI EXISTE EL CARRITO LO DIBUJO
  if (localStorage.getItem("Carrito")) {
    carritoo = JSON.parse(localStorage.getItem("Carrito"));
    actualizarCarritoo();
  }


}


//MUESTRO EN PANTALLA LOS PRODUCTOS FILTRADOS, DICHA LISTA DE PRODUCTOS INGRESAN POR MEDIO DE UN ARREGLO
const mostrarProductosfiltrados = (productos) => {


  contenedorProductos.innerHTML = "";
  productos.forEach(producto => {

    const div = document.createElement('div')
    div.classList.add('producto')
    div.innerHTML = `
  <img src=${producto.img} alt="">
  <h3>${producto.nombre}<h3>
  <p>${producto.desc}</p>
  <p class="precioProducto">Precio: $${producto.precio}</p>
  <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
  `
    contenedorProductos.appendChild(div)

    const boton = document.getElementById(`agregar${producto.id}`)

    //SI PRESIONO EL BOTON AGREGAR, Y EXISTE UN USUARIO LOGEADO ENTONCES AGREGO AL CARRITO
    boton.addEventListener('click', () => {
      usuariocompra = localStorage.getItem("user");

      if (usuariocompra) {
        agregarAlcarrito(producto.id)
      } else {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Debe Identificarse para agregar al carrito!',


        })

      }
    })


  });


}


/********************************************************************** */
/**** INICIO FILTROS de PRODUCTOS*****/
/******************************************************************** */

//AQUI HAGO REFERENCIA AL SELECTOR OPCIONAL DE CATEGORIAS (LISTA DESPLEGABLE CON CATEGORIAS)
const filtrocategoria = document.getElementById("filtroCategoria")

const filtrarProductos = () => {
  const value = filtrocategoria.value

  //SI SELECCIONO "ALL" LLAMO A UNA FUNCION DE LO CONTRARIO LLAMO A OTRA FUNCION
  //APLICO OPERADOR TERNARIO:
  value === "all" ? mostrarProductos() : buscarProducto(value)
}




//INGRESO EL PRODUCTO QUE ESTOY BUSCANDO, SI EXISTE EN MI STOCK, LO AGREGO A UN ARREGLO.
//LUEGO A DICHO ARREGLO LO MUESTRO EN PANTALLA (LISTADO DE PRODUCTOS ENCONTRADOS)
function buscarProducto(value) {

  let productoEncontrado = [];

  fetch('stockTienda.json')
    .then(respuesta => respuesta.json())
    .then(productos => {
      contenedorProductos.innerHTML = "";


      productos.forEach(producto => {

        if (producto.tipo === value) {
          productoEncontrado.push(producto)
        }
        mostrarProductosfiltrados(productoEncontrado)

      })
    })

}

/*cada vez que detecta el evento change en el select html llamado filtroCategoria, llamara a la funcion filtrarProducto */
filtrocategoria.addEventListener("change", () => {
  filtrarProductos();

})

/********************************************************************** */
/**** FIN FILTROS de PRODUCTOS*****/
/******************************************************************** */






/****************************************************************************************************** */
//                              FIN FUNCION MOSTRAR PRODUCTOS DEL STOCK EN PANTALLA
/***************************************************************************************************** */










/****************************************************************************************************** */
//                                         INICIO CARRITO DE COMPRAS
/***************************************************************************************************** */


/*********************************************** */
//        INICIO FUNCION ACTUALIZAR CARRITO
/********************************************** */
const actualizarCarritoo = () => {



  /*esto duplicara la vista porque recorre el array desde cero en cada llamado,
  para que no pase eso, previamento limpiamos la vista del innerhtml*/
  contenedorCarrito.innerHTML = "";

  //RECORRO CARRITO PARA DIBUJARLO, (CARRITO ES EL LOCALSTORAGE)
  carritoo.forEach((prod) => {


    const div = document.createElement('div')
    div.className = 'productoEnCarrito'

    div.innerHTML = `
        <p>cant: ${prod.cantvend} </p>
<p>${prod.nombre}</p>
<p>Precio: $${prod.precio}</p>

<button onclick="eliminarDelcarrito(${prod.id})"class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
`
    contenedorCarrito.appendChild(div);
    //eliminarDelcarrito ES UNA FUNCION QUE UTILIZO PARA BORRAR LOS PRODUCTOS SELECCIONADOS
  })



  //PASO 3 Muestro la cantidad que voy vendiendo
  /*******************************************************************/
  //MANEJA EL CIRCULO DEL CARRITO ES EL CONTADOR DE PRODUCTOS VENDIDOS
  /***************************************************************** */
  contadorCarrito.innerText = ""
  contadorCarrito.innerText = carritoo.length;

  /*sumo el precio de todo el array*/
  precioTotall.innerText = ""
  precioTotall.innerText = carritoo.reduce((acc, prod) => acc + prod.precio * prod.cantvend, 0)


}




/*********************************************** */
//        FIN FUNCION ACTUALIZAR CARRITO
/********************************************** */






/*********************************************** */
//        INICIO FUNCION AGREGAR AL CARRITO
/********************************************** */
const agregarAlcarrito = (prodid) => {

  let itemcarrito = [];

  let item = [];


  fetch('stockTienda.json')
    .then(respuesta => respuesta.json())
    .then(productos => {

      productos.forEach(product => {
        if (product.id === prodid) {
          //agrego al carrito el producto encontrado
          carritoo.push(product);
          localStorage.setItem("Carrito", JSON.stringify(carritoo));

        }

      })
      //muestro en pantalla el producto 
      actualizarCarritoo();

      Swal.fire({
        position: 'center-center',
        icon: 'success',
        title: 'El producto fue agregado al carrito!',
        showConfirmButton: false,
        timer: 1500
      })

    })

}




/*********************************************** */
//        FIN FUNCION AGREGAR AL CARRITO
/********************************************** */





/*************************************************************/
//        INICIO FUNCION EVENTO CLIC BOTON VACIAR CARRITO
/************************************************************/
botonVaciar.addEventListener('click', () => {


  Swal.fire({
    title: 'Realmente desea vaciar el carrito?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Vaciar Carrito',
    denyButtonText: 'No Vaciar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {

    if (result.isConfirmed) {
      Swal.fire('Carrito Vaciado!', '', 'success')



      //PASO 4: Borro el localstorage y el carrito para empezar nuevamente 
      localStorage.removeItem("Carrito")
      carritoo.splice(0, carritoo.length)




      /*actualizarCarrito recorre el array carritoo y lo muestra en el DOM, como esta vacio no muestra nada*/
      actualizarCarritoo();

    } else if (result.isDenied) {
      Swal.fire('Los productos siguen en tu carrito', '', 'info')

    }
  })


})

/*************************************************************/
//        FIN FUNCION EVENTO CLIC BOTON VACIAR CARRITO
/************************************************************/
botonProcesarCompra.addEventListener('click', () => {
  location.href = "compra.html";
})

/*************************************************************/
//        INICIO FUNCION ELIMINAR UN PRODUCTO DEL CARRITO
/************************************************************/

/*eliminar fue agregado en el DOM de actualizar carrito en el evento onclic, de un boton papelera creado usando fontawesome, una pagina de iconos online <i class="fas*/
const eliminarDelcarrito = (prodid) => {

  Swal.fire({
    title: 'Realmente desea eliminar el producto del carrito?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Borrar producto',
    denyButtonText: 'No Borrar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {

    if (result.isConfirmed) {

      /*con find busco el elemento dentro del array */
      const item = carritoo.find((prod) => prod.id === prodid)
      /*busco el indice que tiene en el array el elemento encontrado */
      const indice = carritoo.indexOf(item)

      //BORRO ELEMENTO:
      /*sobre el indice encontrado borro de cantidad de elementos 1 */
      carritoo.splice(indice, 1);
      localStorage.removeItem("Carrito");
      localStorage.setItem("Carrito", JSON.stringify(carritoo));
      /*actualizar vuelve a recorrer el array carrito y lo dibuja en el DOM*/
      actualizarCarritoo();
      calcularTotal();
      //console.log(carritoo)

      Swal.fire('Producto Borrado!', '', 'success')
    } else if (result.isDenied) {
      Swal.fire('El producto sigue en tu carrito', '', 'info')

    }
  })

}
/*************************************************************/
//        FIN FUNCION ELIMINAR UN PRODUCTO DEL CARRITO
/************************************************************/
/******************************************************************************************************** */
//                                  FIN DE CARRITO DE COMPRAS
/******************************************************************************************************* */







/*********************************************************************************************/

//INICIO EVENTO CLIC DEL BOTON CERRAR SESION DEL LOGIN DEL USUARIO

/*********************************************************************************************/
let botoncerrarSesion = document.getElementById("cerrarSesion");

botoncerrarSesion.addEventListener("click", (e) => {
  e.preventDefault();
  respuestaClic2();
})

//cuando el usuario cierra la sesion, consulto el usuario almacenado en el localstorage y lo borro.
//luego limpio todo, preparando al sistema para el nuevo usuario 
function respuestaClic2() {
  usuariocompra = localStorage.getItem("user");
  if (usuariocompra) {

    localStorage.removeItem('user');
    localStorage.removeItem("Carrito");

    mensajePadre.innerHTML = "";

    carritoo.length = 0;
    carritoo.splice(0, carritoo.length);
    actualizarCarritoo()



    /************************* */
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: 'Gracias por visitarnos, esperamos tu regreso.'
    })


    /*********************** */

  }
}
/*********************************************************************************************/

//FIN  EVENTO CLIC DEL BOTON CERRAR SESION DEL LOGIN DEL USUARIO

/*********************************************************************************************/
/******************************************************************** */

/************************************************************************************************ */
//INICIO DEL PROGRAMA LOAD (CARGA)
/************************************************************************************************ */


mostrarProductos();


/*********************************************************************************************** */
                            //FIN DEL PROGRAMA LOAD (CARGA)
/*************************************************************************************************/


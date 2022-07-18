const listaCompra = document.querySelector("#lista-compra tbody");
const carritoCompras = document.getElementById("carritoCompra");//es el div contenedor de la tabla que muestra el carrito
const procesarCompraBtn = document.getElementById("procesar-compra");
const cliente = document.getElementById("cliente");
const correo = document.getElementById("correo");

const cantidad = document.querySelector("cantidad");



/****************************************** */
//ESTA FUNCION ESTA DECLARADA ABAJO DE TODO
/***************************************** */
cargarEvento();


/********************************************************************************************************* */
//LEO LO QUE TENGO EN EL LOCALSTORAGE Y LO CARGO EN PANTALLA
function leerLocalStorageCompra() {

  let productosLS = [];
  productosLS = JSON.parse(localStorage.getItem("Carrito"));
  listaCompra.innerHTML = "";
  let identificador = 0;


  productosLS.forEach((producto) => {
    const row = document.createElement('tr');

    //identificador LO UTILIZO PARA INCREMENTAR Y DECREMENTAR EL BOTON EN EL FUTURO
    identificador = identificador + 1;

    row.innerHTML = `
    <tr>
    <td><img src="${producto.img}" width=10 height=80></td>
    <td>${producto.tipo}</td>
    <td>${producto.precio}</td>
    <td>

    <div class="box">
    <div class="dec button">-</div>
    <input type "number" class="cantidad" class="form-control" id="${identificador}" min="1" value=${producto.cantvend} data-id="${producto.id}" value="0">
    <div class="inc button">+</div>
    </div>

    </td>
    <td id="precioCant">${producto.precio * producto.cantvend}</td>
    <td>
    <a href="a" id="btnid" class="borrar-producto fas fa-times-circle" style="font-size:30px" data-id="${producto.id}"></a>
    </td></tr>
    `;
    listaCompra.appendChild(row);

  });

}
/********************************************************************************************************* */

//SI PRESIONA LA CRUZ AZUL DE LA PANTALLA Y CONFIRMA QUE QUIERE ELIMINAR EL PRODUCTO.
//ENTONCES OBTENGO EL ELEMENTO CON CLASE LLAMADA 'borrar-producto', y lo remuevo.
function eliminarProducto(e) {
  e.preventDefault();
  Swal.fire({
    title: 'Realmente desea eliminar el producto del carrito?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Borrar producto',
    denyButtonText: 'No Borrar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {

    if (result.isConfirmed) {
      let producto, productoID;
      if (e.target.classList.contains("borrar-producto")) {


        e.target.parentElement.parentElement.remove();// si el cliente confirma, elimino el producto
        producto = e.target.parentElement.parentElement;
        productoID = producto.querySelector("a").getAttribute("data-id");

        //llamo a esta funcion para eliminarla del carrito y del localstorage
        eliminarDelcarrito(productoID);
      }

      Swal.fire('Producto Borrado!', '', 'success')

    } else if (result.isDenied) {
      Swal.fire('El producto sigue en tu carrito', '', 'info')

    }
  })


}


/******** ****************************************************************************************************/
const eliminarDelcarrito = (prodid) => {
  let carritoo = JSON.parse(localStorage.getItem("Carrito"));


  let item;
  let indice2;
  //ingreso el id del producto que quiero eliminar, y lo busco en el localstorage
  //al encontrarlo me guardo el id, y su posicion
  for (let i = 0; i < carritoo.length; i++) {
    if (carritoo[i].id == prodid) {
      item = carritoo[i].id;
      indice2 = i;

    }


  }
  /*busco el indice que tiene en el array el elemento encontrado */
  const indice = carritoo.indexOf(item)
  //indexOf le colocas el valor a buscar y te devuelve la posicion en el array que tiene ese valor
  //console.log("valor indice que vamos a usar para borrar"+indice)


  //BORRO ELEMENTO:
  /*sobre el indice encontrado borro de cantidad de elementos 1 */
  carritoo.splice(indice2, 1);


  localStorage.setItem("Carrito", JSON.stringify(carritoo));
  /*actualizar vuelve a recorrer el localstorage carrito y lo dibuja en el DOM*/
  calcularTotal();

}
/********************************************************************************************************* */

//lo utilizo para calcular lo que el cliente pagara
function calcularTotal() {

  let productoLS;
  let total = 0, subtotal = 0, igv = 0;

  productoLS = JSON.parse(localStorage.getItem("Carrito"));

  for (let i = 0; i < productoLS.length; i++) {
    let element = Number(productoLS[i].precio * productoLS[i].cantvend);
    total = total + element;
  }
  igv = parseFloat(total * 0.21).toFixed(2);//solo permito 2 decimales
  subtotal = parseFloat(total - igv).toFixed(2);



  document.getElementById("subtotal").innerHTML = "$ " + subtotal;
  document.getElementById("igv").innerHTML = "$ " + igv;
  document.getElementById("total").innerHTML = "$ " + total.toFixed(2);
}

/********************************************************************************************************* */

function procesarCompra(e) {
  e.preventDefault();
  existeLocalS = JSON.parse(localStorage.getItem("Carrito"));

  if (existeLocalS.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'El carrito esta vacio,agrega algun producto!',
      timer: 2000,
      showConfirmButton: false
    })
    //window.location = "index.html";

  }
  //obligo al cliente a ingresar su nombre y su correo electronico para comprar
  else if (cliente.value === "" || correo.value === "") {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debe ingresar su nombre y correo electronico para continuar.',
      timer: 2000,
      showConfirmButton: false


    })
  }
  else {

    //si la compra se realiza borro el localstorage
    localStorage.removeItem("Carrito");


    Swal.fire({
      position: 'center-center',
      icon: 'success',
      title: 'Su compra fue exitosa, Gracias por confiar en AKIKO!',
      showConfirmButton: true
      //timer: 3000
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = "index.html";


      }
    })



  }
}




/************************************************************************************************ */
//cargarEvento LO EJECUTO ARRIBA
/*********************************************************************************************** */

/************************ */
//INICIO DE cargarEvento()
/************************ */
function cargarEvento() {

  document.addEventListener("DOMContentLoaded", leerLocalStorageCompra()); //dibujo en pantalla lo que tengo en el carrito

  carritoCompras.addEventListener("click", (e) => { //es el div contenedor de la tabla que muestra el carrito
    //lo utilizo para que no se me propague el clic por toda la tabla 
    if (e.target.classList.contains("borrar-producto")) //es el boton del producto a eliminar
      eliminarProducto(e)//llamo a la funcion para eliminar el producto seleccionado
  });

  /*********************************************************************************************/
  calcularTotal(); //muestro el total del carrito en pantalla

  /*********************************************************************************************/
  procesarCompraBtn.addEventListener("click", procesarCompra); //al hacer clic en el boton comprar.

  /****************************************************************************************** */

  //se ejecuta al precionar una tecla en la cantidad que quiero comprar
  document.addEventListener('keydown', (event) => {
    let keyValue = event.key; //capturo la tecla presionada

    let producto;
    let productoID;
    let carritoo;

    if (event.target.classList.contains("cantidad")) {

      carritoo = JSON.parse(localStorage.getItem("Carrito"));
      producto = event.target.parentElement.parentElement;
      productoID = producto.querySelector("input").getAttribute("data-id");


      for (let i = 0; i < carritoo.length; i++) {
        if (carritoo[i].id == productoID) {

          carritoo[i].cantvend = keyValue; //guardo en el localstorage la cantidad de productos que quiere comprar el cliente

          localStorage.setItem("Carrito", JSON.stringify(carritoo));
          leerLocalStorageCompra()
          calcularTotal();
          //location.reload();

        }


      }


    }

  }, false);

  /********************************************************************************************/

  //LO UTILIZO PARA INCREMENTAR LA CANTIDAD QUE DESEA COMPRAR EL CLIENTE
  //incremento
  let incrementButton = document.getElementsByClassName("inc");
  let decrementButton = document.getElementsByClassName("dec");

  for (let i = 0; i < incrementButton.length; i++) {
    let button = incrementButton[i];

    button.addEventListener("click", function (event) {

      let buttonClicked = event.target;
      let input = buttonClicked.parentElement.children[1];

      let inputvalue = input.value;
      let newValue = parseInt(inputvalue) + 1;
      input.value = newValue;



      let producto;
      let productoID;
      let carritoo;
      carritoo = JSON.parse(localStorage.getItem("Carrito"));
      producto = event.target.parentElement.parentElement;
      productoID = producto.querySelector("input").getAttribute("data-id");

      for (let i = 0; i < carritoo.length; i++) {
        if (carritoo[i].id == productoID) {
          carritoo[i].cantvend = newValue;

          localStorage.setItem("Carrito", JSON.stringify(carritoo));
          calcularTotal();
          location.reload();
        }


      }
      //leerLocalStorageCompra()
    })
  }

  //LO UTILIZO PARA DECREMENTAR LA CANTIDAD QUE DESEA COMPRAR EL CLIENTE
  //decremento

  for (let i = 0; i < decrementButton.length; i++) {
    let button = decrementButton[i];

    button.addEventListener("click", function (event) {

      let buttonClicked = event.target;
      let input = buttonClicked.parentElement.children[1];
      let inputvalue = input.value;
      let newValue = parseInt(inputvalue) - 1;

      if (newValue >= 0) {
        input.value = newValue;


        let producto;
        let productoID;
        let carritoo;
        carritoo = JSON.parse(localStorage.getItem("Carrito"));
        producto = event.target.parentElement.parentElement;
        productoID = producto.querySelector("input").getAttribute("data-id");

        for (let i = 0; i < carritoo.length; i++) {
          if (carritoo[i].id == productoID) {
            carritoo[i].cantvend = newValue;

            localStorage.setItem("Carrito", JSON.stringify(carritoo));
            calcularTotal();
            location.reload();
          }


        }

      }

      //leerLocalStorageCompra()
    })
  }



}

/************************ */
//FIN DE cargarEvento()
/************************ */
/********************************************************************************** *******/
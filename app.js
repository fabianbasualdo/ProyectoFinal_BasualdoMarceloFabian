let usuario = "";
let contrasenia = "";
let usuarioStor
let i = 0;
/*****************************OBJETOS************************************/

class Usuario {

    constructor(nombre, contrasenia) {
        this.nombre = nombre.toLowerCase();
        this.contrasenia = contrasenia.toLowerCase();
    }

}


const usuarios = [];
usuarios.push(new Usuario("coder", "house"));
usuarios.push(new Usuario("marcelo", "basualdo85"));
usuarios.push(new Usuario("fabian", "septiembre09"));
usuarios.push(new Usuario("laguna", "santacatalina"));




/********************Creo FUNCION para LOGEO DEL USUARIO******************/

function logueo(usuario, contrasenia, usuarios) {

    let logeoExitoso = false;

    for (const usu of usuarios) {

        if (usu.nombre == usuario) {

            if (usu.contrasenia == contrasenia) {
                return logeoExitoso = true;

            }
            else {
                logeoExitoso = false;

            }
        } else {
            logeoExitoso = false;
        }

    }

    return logeoExitoso;
}




/********************FIN de FUNCION para LOGEO DEL USUARIO******************/

let bandera2 = false;

let boton = document.getElementById("idbtn");

let mensajePadre = document.getElementById("mensajeLogin");

//obtengo el ultimo usuario que logeo en el localstorage
let usuarioStorage = localStorage.getItem("user");


/*********************UTILIZO LA Funcion Logueo, UTILIZO EVENTOS************/


//se utiliza esta parte con funcion flecha para que cuando apriete el boton buscar 
//no se vuelva a recargar el formulario ya que el boton tiene un submit 
//de esa forma evito perder el DOM que le agrego al formulario y sus datos.
boton.addEventListener("click", (e) => {
    e.preventDefault();
    respuestaClic();
})

function respuestaClic() {


    /*Obtengo el valor ingresado por el usuario, en textboxt de usuario y contraseña. */
    usuario = document.querySelector("#idUsuario").value;
    contrasenia = document.querySelector("#idContrasenia").value;

    //paso el usuario y la contraseña a un array
    datosLogueo = [usuario, contrasenia];


    if (usuario != "" && contrasenia != "") {


        /*llamo a la funcion de logueo, la cual me da un retorno de true si encuentra al usuario en un array que contiene a los usuarios registrados */

        //SPREAD::
        //utilizo la funcion logueo la cual recibe tres parametros, los primeros dos parametros se los paso utilizando Spread, es decir, toma el array, pasa los valores de dicho objeto separados por coma.
        bandera2 = logueo(...datosLogueo, usuarios);


        /*Si encuentro al usuario le doy la bienvenida */
        if (bandera2 == true) {

            if (usuarioStor) {
                localStorage.removeItem("user");
            }

            //me fijo si el localstorage ya tiene un usuario logeado
            usuarioStor = localStorage.setItem("user", usuario);

            //si tiene un usuario logeado lo deslogeo para darle paso al nuevo usuario que desea comprar.

            //le doy la bienvenida al nuevo usuario
            mensajePadre.innerHTML = "";
            //alert("Bienvenido :" + usuario);
            localStorage.setItem("user", usuario);


            const mensaje = document.createElement("div");
            mensaje.innerHTML = `usuario: ${usuario}`;
            mensajePadre.append(mensaje);

            //utilizo la funcion para detectar el privilegio del nuevo usuario, para ver si es administrador del sitio
            //DetectarTipoUsuario(usuario);

            //limpio las cajas de texto de logeo
            document.querySelector("#idUsuario").value = "";
            document.querySelector("#idContrasenia").value = "";
        }
        else {
            
            document.querySelector("#idUsuario").value = "";
            document.querySelector("#idContrasenia").value = "";
            document.getElementById("idUsuario").focus();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Usuario o Contraseña invalido.',
            })
        }
    } else {
        document.getElementById("idUsuario").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe ingresar un usuario y una contraseña para validar su ingreso!',


        })



    }
}




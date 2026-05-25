<?php

namespace Controllers;
use Models\Usuario;


class LoginController {
    public static function Login() {

        // Crear un usuario con los datos de login
        $datos = file_get_contents('php://input');
        $data = json_decode($datos, true);
        $autenticar = new Usuario($data);
        //Validar que los datos no esten vacios
        $autenticar->validarDatosLogin();
        $autenticar->Autenticar();
}
    public static function cerrarSession(){
        Usuario::cerrarSession();
    }
    public static function confirmarCuenta(){ 
        $datos = ['token' => $_GET['token']];
        $usuario = new Usuario($datos);
        $usuario->confirmarCuenta();
    }
}
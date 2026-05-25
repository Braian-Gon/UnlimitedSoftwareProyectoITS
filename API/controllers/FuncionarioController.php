<?php

namespace Controllers;

use Models\Funcionario;

class FuncionarioController {

    public static function insertarMarca(){
        $credenciales = Funcionario::validarToken();
        if($credenciales->rol === 'Funcionario'){
            $credenciales = (array) $credenciales;
            $funcionario = new Funcionario($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $funcionario->insertarMarca($data);

        }else {
            Funcionario::cerrarSession();
        }
    }
    public static function getMisMarcas(){
        $credenciales = Funcionario::validarToken();
        if($credenciales->rol === 'Funcionario'){
            $credenciales = (array) $credenciales;
            $funcionario = new Funcionario($credenciales);
            $funcionario->getMisMarcas();

        }else {
            Funcionario::cerrarSession();
        }
    }
    public static function horaSemana(){
        $credenciales = Funcionario::validarToken();
        if($credenciales->rol === 'Funcionario'){
            $credenciales = (array) $credenciales;
            $funcionario = new Funcionario($credenciales);
            $funcionario->getMisHoras();

        }else {
            Funcionario::cerrarSession();
        }
    }
    public static function pausaSemana(){
        $credenciales = Funcionario::validarToken();
        if($credenciales->rol === 'Funcionario'){
            $credenciales = (array) $credenciales;
            $funcionario = new Funcionario($credenciales);
            $funcionario->getMisPausas();

        }else {
            Funcionario::cerrarSession();
        }
    }
}
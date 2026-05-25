<?php

namespace Controllers;

use Models\Supervisor;


class SupervisorController {

    public static function getMarcasEquipo(){
        $credenciales = Supervisor::validarToken();
        if($credenciales->rol === 'Supervisor'){
            $credenciales = (array) $credenciales;
            $supervisor = new Supervisor($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $supervisor->getMarcasEquipo($data);
        }else {
            Supervisor::cerrarSession();
        }
    }
    public static function getMarcasEquipoReportadas(){
        $credenciales = Supervisor::validarToken();
        if($credenciales->rol === 'Supervisor'){
            $credenciales = (array) $credenciales;
            $supervisor = new Supervisor($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $supervisor->getMarcasEquipoReportadas($data);
        }else {
            Supervisor::cerrarSession();
        }
    }
    public static function updateBorrarMarca(){
        $credenciales = Supervisor::validarToken();
        if($credenciales->rol === 'Supervisor'){
            $credenciales = (array) $credenciales;
            $supervisor = new Supervisor($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $supervisor->updateBorrarMarca($data);
        }else {
            Supervisor::cerrarSession();
        }
    }
    public static function getMarca(){
        $credenciales = Supervisor::validarToken();
        if($credenciales->rol === 'Supervisor'){
            $credenciales = (array) $credenciales;
            $supervisor = new Supervisor($credenciales);
            $datos = ["id" => intval($_GET['id'])];
            $supervisor->getMarca($datos);
        }else {
            Supervisor::cerrarSession();
        }
    }
    public static function updateMarca(){
        $credenciales = Supervisor::validarToken();
        if($credenciales->rol === 'Supervisor'){
            $credenciales = (array) $credenciales;
            $supervisor = new Supervisor($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $supervisor->updateMarca($data);
        }else {
            Supervisor::cerrarSession();
        }
    }
    public static function getMisReportes(){
        $credenciales = Supervisor::validarToken();
        if($credenciales->rol === 'Supervisor'){
            $credenciales = (array) $credenciales;
            $supervisor = new Supervisor($credenciales);
            $supervisor->getMisReportes();
        }else {
            Supervisor::cerrarSession();
        }
    }
    public static function updateBorrarReporte(){
        $credenciales = Supervisor::validarToken();
        if($credenciales->rol === 'Supervisor'){
            $credenciales = (array) $credenciales;
            $supervisor = new Supervisor($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $supervisor->updateBorrarReporte($data);
        }else {
            Supervisor::cerrarSession();
        }
    }
    public static function generarReportes(){
        $credenciales = Supervisor::validarToken();
        if($credenciales->rol === 'Supervisor'){
            $credenciales = (array) $credenciales;
            $supervisor = new Supervisor($credenciales);
            $supervisor->generarReportes();
        }else {
            Supervisor::cerrarSession();
        }
    }
}
<?php

namespace Controllers;

use Models\Administrador;

class AdministradorController{

    public static function crearUsuario(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $administrador->crearUsuario($data);
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function getUsuarios(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $administrador->getUsuarios();
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function updateBorrarEmpleado(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $administrador->updateBorrarEmpleado($data);
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function getHorarios(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $administrador->getHorarios();
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function getSupervisores(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $administrador->getSupervisores();
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function getUsuario(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $datos = ["id" => intval($_GET['id'])];
            $administrador->getUsuario($datos);
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function actualizarUsuario(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $administrador->actualizarUsuario($data);
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function getHorariosCompleto(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $administrador->getHorariosCompleto();
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function getHorario(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $datos = ["nombre" =>$_GET['nombre']];
            $administrador->getHorario($datos);
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function actualizarHorario(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $administrador->ActualizarHorario($data);
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function crearHorario(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $administrador->crearHorario($data);
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function eliminarHorario(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $datos = file_get_contents('php://input');
            $data = json_decode($datos, true);
            $administrador->eliminarHorario($data);
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function getAsistencias(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $administrador->getAsistencias();
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function getTotal(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $administrador->getTotal();
        }else {
            Administrador::cerrarSession();
        }
    }
    public static function getAllReportes(){
        $credenciales = Administrador::validarToken();
        if($credenciales->rol === 'Administrador'){
            $credenciales = (array) $credenciales;
            $administrador = new Administrador($credenciales);
            $administrador->getAllReportes();
        }else {
            Administrador::cerrarSession();
        }
    }
}
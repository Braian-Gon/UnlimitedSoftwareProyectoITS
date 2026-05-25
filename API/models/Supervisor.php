<?php

namespace Models;

use Classes\Email;
use Models\Marca;
use Models\Usuario;
use Models\Reporte;

class Supervisor extends Usuario{
    public function getMarcasEquipo ($data){
        $marca = new Marca($data);
        $marca->getMarcasPorEquipo($this->id);
    }
    public function getMarcasEquipoReportadas ($data){
        $marca = new Marca($data);
        $marca->getMarcasPorEquipoReportadas($this->id);
    }
    public function updateBorrarMarca ($data){
        $marca = new Marca($data);
        $marca->updateBorrarMarca($this->id);
    }
    public function crearSupervisor(){
        $query = "insert into cuenta (correo, contraseña, rol, token) value (?, ?, ?, ?);";
        $stmt = Supervisor::$DB->prepare($query);
        $stmt->bind_param("ssss", $this->correo, $this->contraseña, $this->rol, $this->token);
        try {
            $stmt->execute();
            request(200, 'Success', 'Supervisor Creado', '/api/crear-empleado');
            $confirmacion = new Email($this->correo, $this->token);
            $confirmacion->enviarActivacion();
            exit;
            }
        catch(\Throwable){request(405, 'UnSuccess', 'Supervisor no Creado', '/api/crear-empleado'); exit;}
            
    }
    public function actualizarSupervisor(){
        $query = "update cuenta ";
        $query .= "set correo = ?, ";
	    $query .= "contraseña = ? ";
        $query .= "where id = ?; ";
        $stmt = Funcionario::$DB->prepare($query);
        $stmt->bind_param("ssi",$this->correo, $this->contraseña, $this->id);
        if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            if ($filas_afectadas > 0) {
                request(200, 'Success', 'Supervisor modificado', '/api/actualizar-empleado');
                exit;
            } else {
                request(405, 'Unsuccess', 'No se modifico ningún Supervisor', '/api/actualizar-empleado');
                exit;
            }
        } else {
            request(405, 'Unsuccess', 'No se pudo acceder al Supervisor', '/api/actualizar-empleado');
            exit;
        }
        
    }
    public function getMarca($data){
        $marca = new Marca($data);
        $marca->getMarcaUpdate($this->id);
    }
    public function updateMarca ($data){
        $marca = new Marca($data);
        $marca->updateMarca($this->id);
    }
    public function obtenerSupervisor(){
        $query = "Select * from V_Supervisores; ";
        $stmt = Administrador::$DB->prepare($query);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
       if($datos){
          echo json_encode($datos);
          exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron supervisores', '/api/obtener-supervisores');
            exit;
        }
    }
    public function getMisReportes(){
        $reporte = new Reporte(['supervisor_id' => $this->id]);
        $reporte->getReportesSupervisor();
    }
    public function updateBorrarReporte($data){
        $data['supervisor_id'] = $this->id;
        $marca = new Reporte($data);
        $marca->borrarReporte();
    }
    public function generarReportes(){
        $data = ['supervisor_id' => $this->id];
        $marca = new Reporte($data);
        $marca->generarReportes();
    }
}
<?php

namespace Models;
use Models\Horario;
use Models\Supervisor;
use Models\Funcionario;
class Administrador extends Usuario{
    public function crearUsuario ($data){
        if ($data['rol'] === 'Funcionario'){
                $funcionario =  new Funcionario($data);
                $funcionario->validarSupervisor();
                $funcionario->validarHorario();
                $funcionario->hashearContraseña();
                $funcionario->crearToken();
                $funcionario->crearFuncionario();

        }else if($data['rol'] === 'Supervisor'){
            $supervisor = new Supervisor($data);
            $supervisor->hashearContraseña();
            $supervisor->crearToken();
            $supervisor->crearSupervisor($data);
        }else {
            request(405, 'Unauthorized', 'No existe ese rol', '/api/crear-usuario');
            exit;
            }
    }
    public function getUsuarios(){
      $query = "select id, correo, rol, horario, supervisor, estado from V_Usuarios; ";
      $stmt = Usuario::$DB->prepare($query);
      $stmt->execute();
      $resultado = $stmt->get_result();
      $datos = $resultado->fetch_all(MYSQLI_ASSOC);
      if($datos){
          echo json_encode($datos);
          exit;
      }else {
          request(405, 'UnSuccess', 'No se encontraron usuarios', '/api/empleados');
          exit;
      }
  }
  public function updateBorrarEmpleado($data){
      $query = "call P_eliminar_usuario(?);";
      $stmt = Usuario::$DB->prepare($query);
      $stmt->bind_param("i", $data['id']);
      if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            if ($filas_afectadas > 0) {
                request(200, 'Success', 'Usuario eliminado', '/api/eliminar-empleado');
                exit;
            } else {
                request(405, 'Unsuccess', 'No se elimino ningún Usuario', '/api/eliminar-empleado');
                exit;
            }
        } else {
            request(405, 'Unsuccess', 'No se pudo acceder al Usuario', '/api/eliminar-empleado');
            exit;
        }
  }
  public function getHorarios(){
     $horarios =  new Horario();
     $horarios->obtenerHorario();
  }
  public function getSupervisores(){
     $supervisores =  new Supervisor();
     $supervisores->obtenerSupervisor();
  }
  public function getUsuario($data){
     $usuario =  new Usuario($data);
     $usuario->obtenerUsuario();
  }
  public function actualizarUsuario ($data){
    if ($data['rol'] === 'Funcionario'){
          $funcionario =  new Funcionario($data);
          $funcionario->nuevaContraseña();
          $funcionario->actualizarFuncionario();

    }else if($data['rol'] === 'Supervisor'){
        $supervisor= new Supervisor();
        $supervisor->nuevaContraseña();
        $supervisor->actualizarSupervisor();
    }else {
        request(405, 'Unauthorized', 'No existe ese rol', '/api/actualizar-empleado');
        exit;
    }
}
    public function getHorariosCompleto(){
        $horarios =  new Horario();
        $horarios->obtenerHorariosCompleto();
    }
    public function getHorario($datos){
        $horarios =  new Horario($datos);
        $horarios->obtenerHorarioV2();
    }
    public function actualizarHorario($datos){
        $horarios =  new Horario($datos);
        $horarios->actualizarHorario($datos['nombre_old']);
    }
    public function crearHorario($datos){
        $horarios =  new Horario($datos);
        $horarios->crearHorario();
    }
    public function eliminarHorario($data){
        $horarios =  new Horario($data);
        $horarios->eliminarHorario();
    }
    public function getAsistencias(){
      $query = "select * from V_Asistencias; ";
      $stmt = Usuario::$DB->prepare($query);
      $stmt->execute();
      $resultado = $stmt->get_result();
      $datos = $resultado->fetch_assoc();
      if($datos){
          echo json_encode($datos);
          exit;
      }else {
          request(405, 'UnSuccess', 'No se encontraron usuarios', '/api/empleados');
          exit;
      }
    }
    public function getTotal(){
      $query = "select * from V_funcionarios; ";
      $stmt = Usuario::$DB->prepare($query);
      $stmt->execute();
      $resultado = $stmt->get_result();
      $datos = $resultado->fetch_assoc();
      if($datos){
          echo json_encode($datos);
          exit;
      }else {
          request(405, 'UnSuccess', 'No se encontraron funcionarios', '/api/empleados');
          exit;
      }
    }
    public function getAllReportes(){
      $query = "select * from V_reportes_todos; ";
      $stmt = Usuario::$DB->prepare($query);
      $stmt->execute();
      $resultado = $stmt->get_result();
      $datos = $resultado->fetch_all(MYSQLI_ASSOC);
      if($datos){
          echo json_encode($datos);
          exit;
      }else {
          request(405, 'UnSuccess', 'No se encontraron usuarios', '/api/empleados');
          exit;
      }
    }
}
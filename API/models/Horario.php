<?php
namespace Models;
use Models\Administrador;

class Horario{
    private $nombre;
    private $entrada;
    private $salida;
    private $pausa;

    public function __construct($args = [])
    {
        $this->nombre = $args['nombre'] ?? null;
        $this->entrada = $args['entrada'] ?? null;
        $this->salida = $args['salida'] ?? null;
        $this->pausa = $args['pausa'] ?? null;
    }

    public function crearHorario(){
        $query = "insert into horario (nombre, entrada, salida, pausa ) value ( ?, ?, ?, ?);";
        $stmt = Administrador::$DB->prepare($query);
        $stmt->bind_param("sssi", $this->nombre, $this->entrada, $this->salida, $this->pausa);
        try {
            $stmt->execute();
            request(200, 'Success', 'Horario Creado', '/api/crear-horario');
            exit;
            }
        catch(\Throwable){request(405, 'UnSuccess', 'Horario no Creado', '/api/crear-horario'); exit;}
    }

    public function actualizarHorario($old){
        $query = "update horario ";
        $query .= "set nombre = ?, ";
        $query .= "entrada = ?, ";
        $query .= "salida = ?, ";
        $query .= "pausa = ? ";
        $query .= "where nombre = ?;";
        $stmt = Administrador::$DB->prepare($query);
        $stmt->bind_param("sssis", $this->nombre, $this->entrada, $this->salida, $this->pausa, $old);
        if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            if ($filas_afectadas > 0) {
                request(200, 'Success', 'Horario actualizado', '/api/actualizar-horario');
                exit;
            } else {
                request(405, 'Unsuccess', 'No se logro actualizar el Horario', '/api/actualizar-horario');
                exit;
            }
        } else {
            request(405, 'Unsuccess', 'No se pudo acceder al Horario', '/api/actualizar-horario');
            exit;
        }
    }
    public function obtenerHorario(){
        $query = "Select nombre from horario where estado != 'Desactivado'; ";
        $stmt = Administrador::$DB->prepare($query);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
       if($datos){
          echo json_encode($datos);
          exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron horarios', '/api/obtener-horarios');
            exit;
        }
    }
    public function obtenerHorariosCompleto(){
        $query = "Select nombre, entrada, salida, pausa from horario where estado != 'Desactivado'; ";
        $stmt = Administrador::$DB->prepare($query);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
       if($datos){
          echo json_encode($datos);
          exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron horarios', '/api/obtener-horarios');
            exit;
        }
    }
    public function obtenerHorarioV2(){
        $query = "Select nombre, entrada, salida, pausa from horario where estado != 'Desactivado' and nombre = ?; ";
        $stmt = Administrador::$DB->prepare($query);
        $stmt->bind_param("s",$this->nombre);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_assoc();
       if($datos){
          echo json_encode($datos);
          exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron horarios', '/api/obtener-horario');
            exit;
        }
    }
    public function eliminarHorario(){
        $query = "update horario ";
        $query .= "set estado = 'Desactivado' ";
        $query .= "where nombre = ?;";
        $stmt = Administrador::$DB->prepare($query);
        $stmt->bind_param("s", $this->nombre);
        if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            if ($filas_afectadas > 0) {
                request(200, 'Success', 'Horario eliminado', '/api/actualizar-horario');
                exit;
            } else {
                request(405, 'Unsuccess', 'No se logro eliminar el Horario', '/api/actualizar-horario');
                exit;
            }
        } else {
            request(405, 'Unsuccess', 'No se pudo acceder al Horario', '/api/actualizar-horario');
            exit;
        }
    }
}
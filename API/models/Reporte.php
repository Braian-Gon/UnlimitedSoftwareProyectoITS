<?php

namespace Models;


class Reporte {
    private $id;
    private $supervisor_id;
    
    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->supervisor_id = $args['supervisor_id'] ?? null;
    }

    public function getReportesSupervisor(){
        $query = "select id, correo, horas_trabajadas, horas_maximas, pausa_realizadas, pausas_maximas, asistencia, fecha_reporte from V_reportes_semanal where supervisor_id = ?;";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("i", $this->supervisor_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        if($datos){
            echo json_encode($datos);
            exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron reportes', '/api/obtener-reportes');
            exit;
        }
    }
    public function getReportes(){
        $query = "select id, correo, horas_trabajadas, horas_maximas, pausa_realizadas, pausas_maximas, asistencia, fecha_reporte from V_reportes_semanal where estado != 'Desactivado';";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("i", $this->supervisor_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        if($datos){
            echo json_encode($datos);
            exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron reportes', '/api/obtener-reportes');
            exit;
        }
    }
    public function borrarReporte(){
        $query = "update reportes ";
        $query .= "set estado = 'Desactivado' ";
        $query .= "where id = ? and supervisor_id = ?; ";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("ii", $this->id, $this->supervisor_id);
        if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            if ($filas_afectadas > 0) {
                request(200, 'Success', 'Reporte borrado', '/api/borrar-reporte');
                exit;
            } else {
                request(403, 'Unsuccess', 'Acceso no autorizado al reporte', '/api/borrar-reporte');
                exit;
            }
        } else {
            request(404, 'Unsuccess', 'No se pudo acceder al reporte', '/api/borrar-reporte');
            exit;
        }
    }
    public function generarReportes(){
        $query = "call P_reporte_semanal(?); ";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("i", $this->supervisor_id);
        try {
            $stmt->execute();
            request(200, 'Success', 'Reporte generado', '/api/generar-reporte'); exit;}
        catch(\Throwable){request(405, 'UnSuccess', 'No se pudo crear el reporte', '/api/generar-reporte');exit;}
    }
}
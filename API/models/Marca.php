<?php
namespace Models;
use Models\Usuario;

class Marca {
    private $id;
    private $tipo;
    private $fecha_hora;
    private $empleado_id;
    private $observacion;
    public function __construct($args=[]) {
        $this->id = $args['id'] ?? null;
        $this->fecha_hora = $args['fecha_hora'] ?? null;
        $this->tipo = $args['tipo'] ?? null;
        $this->empleado_id = $args['empleado_id'] ?? null;
        $this->observacion = $args['observacion'] ?? null;
    }
    public function validarTipoMarca(){
        if($this->tipo === "Entrada" || $this->tipo === "Salida" || $this->tipo === "Pausa" || $this->tipo === "Regreso"){
            
        }else {
            request(406, 'Unsuccessful', 'Tipo de marca inválida', '/api/marca'); 
            exit;
        }
    }

    public function insertarMarca(){
        $query = "INSERT INTO marca (empleado_id, tipo, observacion) value (?, ?, ?);";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("iss", $this->empleado_id, $this->tipo, $this->observacion);
        try {
            $stmt->execute();
                request(200, 'Success', 'Marca Registrada', '/api/marca');
                exit;
        } catch (\Throwable) {
            request(405, 'Unsuccessful', 'Marca no se pudo registrar', '/api/marca');
            exit;
        }

    }
    public function getMarca(){
        $query = "select id, fecha_hora, tipo, observacion from marca where empleado_id = ? and estado != 'Desactivado';";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("i", $this->empleado_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        if($datos){
            echo json_encode($datos);
            exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron marcas', '/api/marca');
            exit;
        }
    } 

    public function getMisHoras(){
        $query = "select coalesce(sum(minutos_t),0) trabajo from V_Trabajo ";
        $query.= "where ";
        $query.= "week(V_Trabajo.fecha) = week(now()) and year(V_Trabajo.fecha) = year(now()) and id =?;";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("i", $this->empleado_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $dato = $resultado->fetch_assoc();
        if($dato){
            echo json_encode($dato);
            exit;
        }else {
            request(405, 'Unsuccess', 'No hay tiempo de trabajo marcado', '/api/marca');
            exit;
        }
    }
    public function getMisPausas(){
        $query = "select coalesce(sum(minutos_p),0) pausa from V_Pausa ";
        $query.= "where ";
        $query.= "week(V_Pausa.fecha) = week(now()) and year(V_Pausa.fecha) = year(now()) and id =?;";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("i", $this->empleado_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $dato = $resultado->fetch_assoc();
        if($dato){
            echo json_encode($dato);
            exit;
        }else {
            request(405, 'Unsuccess', 'No hay tiempo de trabajo marcado', '/api/marca');
            exit;
        }
    }
    public function getMarcasPorEquipo($supervisor_id){
        $query = "select marca.id, correo, fecha_hora, tipo, observacion, marca.estado, marca.observacion  from marca, supervisa, cuenta ";
        $query.= "where marca.empleado_id = supervisa.empleado_id and supervisor_id = ? and supervisa.empleado_id = cuenta.id and marca.estado != 'Desactivado';";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("i", $supervisor_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        if($datos){
            echo json_encode($datos);
            exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron marcas', '/api/marca');
            exit;
        }
    }
    public function getMarcasPorEquipoReportadas($supervisor_id){
        $query = "select marca.id id, correo, fecha_hora, tipo, observacion from marca, supervisa, cuenta ";
        $query.= "where marca.empleado_id = supervisa.empleado_id and supervisa.empleado_id = cuenta.id and supervisor_id = ? and marca.estado = 'Reportado';";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("i", $supervisor_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        if($datos){
            echo json_encode($datos);
            exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron marcas', '/api/marca');
            exit;
        }
    }
    public function updateMarca($supervisor_id){
        $query = "UPDATE marca ";
        $query .= "JOIN supervisa ON supervisa.empleado_id = marca.empleado_id ";
        $query .= "SET estado = 'Verificado', ";
        $query .= "fecha_hora = ?, "; 
        $query .= "observacion = ? ";
        $query .= "WHERE ";
	    $query .= "marca.empleado_id = supervisa.empleado_id and supervisa.supervisor_id = ? and marca.id = ? and marca.estado != 'Desactivado'; ";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("ssii",$this->fecha_hora, $this->observacion, $supervisor_id, $this->id);
        if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            if ($filas_afectadas > 0) {
                request(200, 'Success', 'Marca alterada', '/api/marca');
                exit;
            } else {
                request(405, 'Unsuccess', 'Acceso no autorizado a la marca', '/api/marca');
                exit;
            }
        } else {
            request(405, 'Unsuccess', 'No se pudo acceder a la marca', '/api/marca');
            exit;
        }
    }
    public function updateBorrarMarca($supervisor_id){
        $query = "UPDATE marca ";
        $query .= "JOIN supervisa ON supervisa.empleado_id = marca.empleado_id ";
        $query .= "SET estado = 'Desactivado' ";
        $query .= "WHERE "; 
        $query .= "marca.empleado_id = supervisa.empleado_id and supervisa.supervisor_id = ? and marca.id = ? and marca.estado != 'Desactivado';";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("ii", $supervisor_id, $this->id);
        if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            if ($filas_afectadas > 0) {
                request(200, 'Success', 'Marca borrada', '/api/marca');
                exit;
            } else {
                request(405, 'Unsuccess', 'Acceso no autorizado a la marca', '/api/marca');
                exit;
            }
        } else {
            request(405, 'Unsuccess', 'No se pudo acceder a la marca', '/api/marca');
            exit;
        }
    }
    public function getMarcaUpdate($supervisor_id){
        $query = "select marca.id id, correo, fecha_hora, tipo, observacion from marca,supervisa, cuenta ";
        $query.= "where ";
        $query.= "marca.empleado_id = supervisa.empleado_id and cuenta.id =  supervisa.empleado_id and supervisa.supervisor_id = ? and marca.id = ? and marca.estado != 'Desactivado';";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("ii", $supervisor_id, $this->id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        if($datos){
            echo json_encode($datos);
            exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron marcas', '/api/marca');
            exit;
        }
    } 

}
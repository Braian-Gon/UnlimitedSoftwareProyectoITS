<?php

namespace Models;

use Classes\Email;
use Models\Usuario;
use Models\Marca;
class Funcionario extends Usuario{
    private $horario;
    private $supervisor;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->correo = $args['correo'] ?? null;
        $this->contraseña = $args['contraseña'] ?? null;
        $this->rol = $args['rol'] ?? null;
        $this->estado = $args['estado'] ?? null;
        $this->horario = $args['horario'] ?? null;
        $this->supervisor = $args['supervisor_id'] ?? null;
    }
    
    public function insertarMarca($data=[]){
        $data['empleado_id'] = $this->id;
        $marca = new Marca($data);
        $marca->validarTipoMarca();
        $marca->insertarMarca();
    }
    public function getMisMarcas($data=[] ?? $data= []){
        $data['empleado_id'] = $this->id;
        $marca = new Marca($data);
        $marca->getMarca();
    }
    public function getMishoras(){
        $data['empleado_id'] = $this->id;
        $marca = new Marca($data);
        $marca->getMisHoras();
    }
    public function getMisPausas(){
        $data['empleado_id'] = $this->id;
        $marca = new Marca($data);
        $marca->getMisPausas();
    }
    public function crearFuncionario(){
        $query = "call P_crear_funcionario(?, ?, ?, ?, ?, ?);";
        $stmt = Funcionario::$DB->prepare($query);
        $stmt->bind_param("ssssis", $this->correo, $this->contraseña, $this->horario, $this->rol, $this->supervisor, $this->token);
        try {
            $stmt->execute();
            request(200, 'Success', 'Funcionario Creado', '/api/crear-empleado');
            $confirmacion = new Email($this->correo, $this->token);
            $confirmacion->enviarActivacion();
            exit;
            }
        catch(\Throwable){request(405, 'UnSuccess', 'Funcionario no Creado', '/api/crear-empleado'); exit;}
            

    }
    public function actualizarFuncionario(){
        $query = "update cuenta ";
        $query .= "INNER JOIN supervisa ON cuenta.id = supervisa.empleado_id " ;
        $query .= "set cuenta.correo = ?, ";
		$query .= "cuenta.contraseña = ?, ";
        $query .= "cuenta.horario = ?, ";
        $query .= "supervisa.supervisor_id = ? ";
        $query .= "where cuenta.id = ?;";
        $stmt = Funcionario::$DB->prepare($query);
        $stmt->bind_param("sssii",$this->correo, $this->contraseña, $this->horario, $this->supervisor, $this->id);
        if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            if ($filas_afectadas > 0) {
                request(200, 'Success', 'Funcionario modificado', '/api/actualizar-empleado');
                exit;
            } else {
                request(405, 'Unsuccess', 'No se modifico ningún Funcionario', '/api/actualizar-empleado');
                exit;
            }
        } else {
            request(405, 'Unsuccess', 'No se pudo acceder al Funcionario', '/api/actualizar-empleado');
            exit;
        }
    }
    public function validarSupervisor(){
        if($this->supervisor === ''){
            $this->supervisor = null;
        }
        else{
            $this->supervisor = intval($this->supervisor);
        }
    }
   public function validarHorario(){
        if($this->horario === ''){
            $this->horario = null;
        }
    }
}
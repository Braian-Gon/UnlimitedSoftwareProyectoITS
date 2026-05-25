<?php
namespace Models;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use DomainException;
use InvalidArgumentException;
use UnexpectedValueException;

class Usuario{
    protected $id;
    protected $correo;
    protected $contraseña;
    protected $rol;
    protected $estado;
    public static $DB;
    private static $secret;
    protected $token;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->correo = $args['correo'] ?? null;
        $this->contraseña = $args['contraseña'] ?? null;
        $this->rol = $args['rol'] ?? null;
        $this->estado = $args['estado'] ?? null;
        $this->token = $args['token'] ?? null;
    }

    public static function setDB($db) {
        self::$DB = $db;
    }
    public static function setSecret($key) {
        self::$secret = $key;
    }

    public function validarDatosLogin(){
        if (!$this->correo){
           request(403, 'Unauthorized', 'El correo no puede estar vacio', '/api/login');
           exit;
        }
        if (!$this->contraseña){
            request(403, 'Unauthorized', 'La contraseña no puede estar vacio', '/api/login');
            exit;
        }
    }

    public function Autenticar(){
        $query = "SELECT id, rol, contraseña FROM cuenta WHERE correo = ? and estado = 'Activo' LIMIT 1;";
        //Preparar Consulta
        $stmt = self::$DB->prepare($query);
        $stmt->bind_param("s", $this->correo);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_assoc();

        if(!$datos){
            request(403,'Unauthorized',"Correo no válido", '/api/login');
            exit;
        }else {
            $this->validarContraseña($datos);
        }
    }

    private function validarContraseña($datos = []){
        $resultado = password_verify($this->contraseña, $datos['contraseña']);
        if($resultado) {
            setcookie("session_cookie_us", $this->Token($datos), time()+21600, httponly:true);
            request(200, 'Authorized', $datos['rol'], '/api/login');  
            exit;
        }else{
            request(403,'Unauthorized',"Contraseña no válida", '/api/login');
            exit;
        }
    }

    protected function Token($datos = []){
        $payload = [
            'id' => $datos['id'],
            'rol' => $datos['rol'],
            'exp' => time() + 21600,
        ];
        $encode = JWT::encode($payload, self::$secret, 'HS256');
        return $encode;
    }
    public static function cerrarSession(){
        setcookie("session_cookie_us", '' , time() - 100000000 , httponly:true);
        request(200, 'Logout', 'Cierre de sesión exitoso', '/api/logout');
        exit;
    }

    public static function validarToken(){
        if(empty($_COOKIE['session_cookie_us'])){
            request(410,'No cookies',"No se encontro una sesión", '/api/login-token');
            exit;
        }
        else {
            $token = $_COOKIE['session_cookie_us'];
           return self::decodificarToken($token);
        }
    }
    private static function decodificarToken($token){
        
        try {
        $decoded = JWT::decode($token, new Key(Usuario::$secret, 'HS256'));
        } catch (InvalidArgumentException) {
            self::cerrarSession();
        } catch (DomainException) {
            self::cerrarSession();
        } catch (SignatureInvalidException) {
            self::cerrarSession();
        } catch (BeforeValidException) {
            self::cerrarSession();
        } catch (ExpiredException) {
            self::cerrarSession();
        } catch (UnexpectedValueException) {
            self::cerrarSession();
        }

        return $decoded;
    }
    
    public function obtenerUsuario(){
        $query = "Select id, correo, rol, horario, supervisor_id from V_Usuarios where id = ?; ";
        $stmt = Administrador::$DB->prepare($query);
        $stmt->bind_param("i", $this->id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_assoc();
        if($datos){
            echo json_encode($datos);
            exit;
        }else {
            request(405, 'UnSuccess', 'No se encontraron usuarios', '/api/obtener-usuario');
            exit;
        }
    
    }
    protected function hashearContraseña(){
        $this->contraseña = password_hash($this->contraseña, PASSWORD_BCRYPT);
    }
    public function nuevaContraseña(){
        if($this->contraseña){
            $this->hashearContraseña();
        }
    }
    public function crearToken(){
        $this->token = uniqid();
    }
    public function confirmarCuenta(){
        $query = "update cuenta ";
        $query .= "set token = '', ";
        $query .= " estado = 'Activo' ";
        $query .= "where token = ?; ";
        $stmt = Usuario::$DB->prepare($query);
        $stmt->bind_param("s", $this->token);
        if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            if ($filas_afectadas > 0) {
                request(200, 'Success', 'Cuenta activada', '/api/confirmar-cuenta');
                exit;
            } else {
                request(403, 'Unsuccess', 'No se activo la cuenta', '/api/confirmar-cuenta');
                exit;
            }
        } else {
            request(406, 'Unsuccess', 'No se pudo acceder a la cuenta', '/api/confirmar-cuenta');
            exit;
        }
    
    }
}
    
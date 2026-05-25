<?php

abstract class Database{
    private static $host = 'localhost';
    private static $user = 'api-web';
    private static $password = 'prueba';
    private static $database = 'api_us';

    public static function ConexionDB(){

        $DB = new mysqli(self::$host, self::$user, self::$password, self::$database);
        if($DB->connect_errno) {
            die("Conexión Fallida: " . $DB->connect_errno);
        }
        else{
            return $DB;
        }
    }
}
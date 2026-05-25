<?php

namespace Api;

class Router {
    private $getRutas = [];
    private $postRutas = [];
    private $putRutas = [];

    public function get($url, $fn){
        $this->getRutas[$url] = $fn;
    }

    public function post($url, $fn){
        $this->postRutas[$url] = $fn;
    }
    public function put($url, $fn){
        $this->putRutas[$url] = $fn;
    }

    public function comprobarRutas(){

        $urlActual = $_SERVER['PATH_INFO'] ?? '/';
        $metodo = $_SERVER['REQUEST_METHOD'];

        switch ($metodo){
            case 'GET': 
                $funcion = $this->getRutas[$urlActual] ?? null;
                break;
            case 'POST':
                $funcion = $this->postRutas[$urlActual] ?? null;
                break;
            case 'PUT':
                $funcion = $this->putRutas[$urlActual] ?? null;
        }

        if($funcion){
            call_user_func($funcion);

        }else {
            echo "Ruta no válida";
        }
    }
}
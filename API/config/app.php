<?php
require 'funciones.php';
require __DIR__ . '/../vendor/autoload.php';
require 'Database.php';
use Models\Usuario;
$db = Database::ConexionDB();
Usuario::setDB($db);
Usuario::setSecret('asnfsaf76saf675456fasddf');
<?php
require_once __DIR__ . '/../config/app.php';
use Api\Router;
use Controllers\AdministradorController;
use Controllers\LoginController;
use Controllers\FuncionarioController;
use Controllers\SupervisorController;

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Authorization, Accept");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Credentials: true");



$router = new Router();

// Endpoints
$router->post('/api/login',[LoginController::class, 'login']);
$router->get('/api/logout',[LoginController::class, 'cerrarSession']);
$router->get('/api/confirmar-cuenta/',[LoginController::class, 'confirmarCuenta']);
// Endpoints funcionarios
$router->post('/api/marca', [FuncionarioController::class, 'insertarMarca']);
$router->get('/api/mis-marcas', [FuncionarioController::class, 'getMisMarcas']);
$router->get('/api/hora-semana', [FuncionarioController::class, 'horaSemana']);
$router->get('/api/pausa-semana', [FuncionarioController::class, 'pausaSemana']);
// Endpoints supervisores
$router->get('/api/marcas-equipo', [SupervisorController::class, 'getMarcasEquipo']);
$router->get('/api/marcas-equipo-reportadas', [SupervisorController::class, 'getMarcasEquipoReportadas']);
$router->put('/api/borrar-marca', [SupervisorController::class, 'updateBorrarMarca']);
$router->get('/api/obtener-marca/', [SupervisorController::class, 'getMarca']);
$router->put('/api/verificar-marca', [SupervisorController::class, 'updateMarca']);
$router->get('/api/obtener-mis-reportes', [SupervisorController::class, 'getMisReportes']);
$router->put('/api/borrar-reporte', [SupervisorController::class, 'updateBorrarReporte']);
$router->post('/api/generar-reportes', [SupervisorController::class, 'generarReportes']);
//Endpoints administrador
$router->get('/api/empleados', [AdministradorController::class, 'getUsuarios']);
$router->put('/api/eliminar-empleado', [AdministradorController::class, 'updateBorrarEmpleado']);
$router->get('/api/obtener-horarios', [AdministradorController::class, 'getHorarios']);
$router->get('/api/obtener-supervisores', [AdministradorController::class, 'getSupervisores']);
$router->get('/api/obtener-usuario/', [AdministradorController::class, 'getUsuario']);
$router->post('/api/crear-empleado', [AdministradorController::class, 'crearUsuario']);
$router->put('/api/actualizar-empleado', [AdministradorController::class, 'actualizarUsuario']);
$router->get('/api/obtener-horarios-c', [AdministradorController::class, 'getHorariosCompleto']);
$router->get('/api/obtener-horario/', [AdministradorController::class, 'getHorario']);
$router->put('/api/actualizar-horario', [AdministradorController::class, 'actualizarHorario']);
$router->post('/api/crear-horario', [AdministradorController::class, 'crearHorario']);
$router->put('/api/eliminar-horario', [AdministradorController::class, 'eliminarHorario']);
$router->get('/api/asistencias', [AdministradorController::class, 'getAsistencias']);
$router->get('/api/total', [AdministradorController::class, 'getTotal']);
$router->get('/api/reportes-todos', [AdministradorController::class, 'getAllReportes']);
$router->comprobarRutas();
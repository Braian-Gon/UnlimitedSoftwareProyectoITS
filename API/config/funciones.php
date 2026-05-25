<?php
function request($status, $titulo, $info, $instancia){
    header("HTTP/1.1 $status $titulo");
    header('Content-Type: application/json');
    $body = [
        'status' => $status,
        'detail' => $info,
        'instance' => $instancia
    ];
    echo json_encode($body);
    
}
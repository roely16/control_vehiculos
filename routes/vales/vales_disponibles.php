<?php 

    require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';

    $con_vale = new ValeController();

    $datos = $con_vale->vales_disponibles();

    echo json_encode($datos);

?>
<?php 

    require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';

    $con_vale = new valeController();

    $data = $con_vale->tipos_talonarios();

    echo json_encode($data);

?>
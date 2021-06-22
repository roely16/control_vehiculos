<?php 

    require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/SolicitudesValesController.php';

    $_POST = json_decode(file_get_contents('php://input'), true);

    $solicitudes_pendientes_ctrl = new SolicitudesValesController();

    $datos = $solicitudes_pendientes_ctrl->verificar_asignacion_vale($_POST);

    echo json_encode($datos);

?>
<?php  

    require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ConfiguracionController.php';

    $configuracion_ctrl = new ConfiguracionController();

    $datos = $configuracion_ctrl->obtenerAccesos();

    echo json_encode($datos);

?>
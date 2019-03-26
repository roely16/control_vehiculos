<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ConfiguracionController.php';

	$configuracion_ctrl = new ConfiguracionController();

	$datos = $configuracion_ctrl->obtener_vehiculos_administrador($_REQUEST["empleado_nit"]);

	echo json_encode($datos);

?>
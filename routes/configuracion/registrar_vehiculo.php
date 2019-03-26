<?php 
	
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ConfiguracionController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$configuracion_ctrl = new ConfiguracionController();

	$datos = $configuracion_ctrl->registrar_vehiculo($_POST);

	echo json_encode($datos);


?>
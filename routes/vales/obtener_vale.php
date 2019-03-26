<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';

	$con_vale = new ValeController();
	
	$datos = $con_vale->obtener_vale($_REQUEST["id"]);

	echo json_encode($datos);

?>
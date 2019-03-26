<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';

	$con_vale = new ValeController();
	
	$datos = $con_vale->responsable_selected($_REQUEST["id"]);

	echo json_encode($datos);

?>
<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';

	$con_vale = new valeController();

	$datos = $con_vale->obtener_vales();

	echo json_encode($datos);

?>
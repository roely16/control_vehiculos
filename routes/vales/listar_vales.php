<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';

	$con_vehiculo = new ValeController();

	$datos = $con_vehiculo->listar_vales();

	echo json_encode($datos);


?>
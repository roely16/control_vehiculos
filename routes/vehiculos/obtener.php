<?php  
	
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/VehiculoController.php';

	$con_vehiculo = new VehiculoController();

	$datos = $con_vehiculo->listar_vehiculos();

	echo json_encode($datos);

?>
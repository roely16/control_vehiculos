<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/VehiculoController.php';

	$con_vehiculo = new VehiculoController();

	$con_vehiculo->registrar_vehiculo($_REQUEST);

	//header('Location: /control_vehiculos/#/vehiculos');


?>
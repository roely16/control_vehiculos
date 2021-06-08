<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/VehiculoController.php';

	$con_vehiculo = new VehiculoController();

	$datos = $con_vehiculo->listar_vehiculos_cuota();

	echo json_encode($datos);

?>

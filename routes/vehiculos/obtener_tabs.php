<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/VehiculoController.php';

	$vehiculo_ctrl = new VehiculoController();

	$datos = $vehiculo_ctrl->obtenerTabs();

	echo json_encode($datos);

?>

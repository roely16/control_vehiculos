<?php 

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Mantenimiento_VehiculoController.php';

	$mantenimiento_ctrl = new Mantenimiento_VehiculoController();

	$datos = $mantenimiento_ctrl->detalles_mantenimiento($_REQUEST["id"]);

	echo json_encode($datos);

?>
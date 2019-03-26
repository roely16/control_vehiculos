<?php 

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Mantenimiento_VehiculoController.php';

	$mantenimiento_ctrl = new Mantenimiento_VehiculoController();

	$datos = $mantenimiento_ctrl->eliminar_mantenimiento($_REQUEST["id"], $_REQUEST["inventario_id"]);

	echo json_encode($datos);


?>
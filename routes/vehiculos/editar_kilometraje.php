<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/VehiculoController.php';

	$vehiculo_ctrl = new VehiculoController();
	
	$datos = $vehiculo_ctrl->actualizar_kilometraje_2($_REQUEST["id"], $_REQUEST["km"]);

	echo json_encode($datos);

?>
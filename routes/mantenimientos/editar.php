<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Mantenimiento_VehiculoController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$mantenimiento_ctrl = new Mantenimiento_VehiculoController();

	$respuesta = $mantenimiento_ctrl->editar_mantenimiento($_POST);
	
	echo json_encode($respuesta);
	

?>
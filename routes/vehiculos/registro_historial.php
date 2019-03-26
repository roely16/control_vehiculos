<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/VehiculoController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);
	
	$con_vehiculo = new VehiculoController();

	$data = $con_vehiculo->registrar_historial($_POST);
	
	var_dump($_POST);

?>
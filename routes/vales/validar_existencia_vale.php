<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';

	$con_vale = new ValeController();

	$respuesta = $con_vale->validar_existencia_vale($_REQUEST["id"], $_REQUEST["valeid"]);

	echo json_encode($respuesta);

?>
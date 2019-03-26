<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/DocumentosController.php';

	$documento_ctrl = new DocumentosController();

	$datos = $documento_ctrl->eliminar_documento($_REQUEST["id"]);

	echo json_encode($datos);

?>
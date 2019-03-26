<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/DocumentosController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$documento_ctrl = new DocumentosController();

	$data = $documento_ctrl->editar_documento_vale($_POST);

	echo json_encode($data);

?>
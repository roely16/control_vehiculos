<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/CuotaController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$cuota_ctrl = new CuotaController();

	$cuotas = $cuota_ctrl->editar_cuota($_POST);

	echo json_encode($cuotas);

?>
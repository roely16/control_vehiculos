<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/HistorialController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$historial_ctrl = new HistorialController();

	$historial = $historial_ctrl->registrar_historial($_POST);

	echo json_encode($historial);

?>
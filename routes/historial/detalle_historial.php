<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/HistorialController.php';

	$historial_ctrl = new HistorialController();

	$datos = $historial_ctrl->detalle_historial($_REQUEST["id"]);

	echo json_encode($datos);

?>
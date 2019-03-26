<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ReporteController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$reporte_ctrl = new ReporteController();

	$respuesta = $reporte_ctrl->reporte_general_rendimiento($_POST);
	
	echo json_encode($respuesta);

?>
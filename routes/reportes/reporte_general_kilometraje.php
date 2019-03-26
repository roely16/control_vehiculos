<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ReporteController.php';

	$reporte_ctrl = new ReporteController();

	$respuesta = $reporte_ctrl->reporte_general_kilometraje();
	
	echo json_encode($respuesta);

?>
<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/CorrectivasController.php';

	$repuesto_ctrl = new CorrectivasController();

	$datos = $repuesto_ctrl->detalle_gestion($_REQUEST["id"]);

	echo json_encode($datos);

?>
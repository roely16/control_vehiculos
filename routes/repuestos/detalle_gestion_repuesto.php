<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/RepuestosController.php';

	$repuesto_ctrl = new RepuestosController();

	$datos = $repuesto_ctrl->detalle_gestion($_REQUEST["id"]);

	echo json_encode($datos);

?>
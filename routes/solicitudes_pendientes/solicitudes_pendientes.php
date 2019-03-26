<?php 
	
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/SolicitudesValesController.php';

	$solicitudes_pendientes_ctrl = new SolicitudesValesController();

	$datos = $solicitudes_pendientes_ctrl->mostrar_solicitudes_pendientes();

	echo json_encode($datos);

?>
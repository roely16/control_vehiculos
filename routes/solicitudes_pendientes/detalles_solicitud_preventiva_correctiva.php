<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/SolicitudesValesController.php';

	$solicitudes_pendientes_ctrl = new SolicitudesValesController();

	$datos = $solicitudes_pendientes_ctrl->detalles_solicitud_preventiva_correctiva($_REQUEST["id"]);

	echo json_encode($datos);

?>
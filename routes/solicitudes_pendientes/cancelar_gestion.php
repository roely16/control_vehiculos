<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/SolicitudesValesController.php';

	$solicitudes_ctrl = new SolicitudesValesController();

	$datos = $solicitudes_ctrl->cancelar_gestion($_REQUEST["id"]);

	echo json_encode($datos);

?>
<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/CorrectivasController.php';

	$repuesto_ctrl = new CorrectivasController();

	$datos = $repuesto_ctrl->actualizar_gestion($_REQUEST["id"],$_REQUEST['estado']);

	echo json_encode($datos);

?>
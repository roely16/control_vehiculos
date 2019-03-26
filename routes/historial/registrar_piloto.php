<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/HistorialController.php';

	$historial_ctrl = new HistorialController();

	$datos = $historial_ctrl->registrar_piloto($_REQUEST["nit_piloto"]);

	echo json_encode($datos);

?>
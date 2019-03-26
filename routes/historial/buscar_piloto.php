<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/HistorialController.php';

	$historial_ctrl = new HistorialController();

	$datos = $historial_ctrl->buscar_piloto($_REQUEST["nombre_piloto"]);

	echo json_encode($datos);

?>
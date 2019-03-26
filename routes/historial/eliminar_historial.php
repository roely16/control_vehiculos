<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/HistorialController.php';

	$historial_ctrl = new HistorialController();

	$datos = $historial_ctrl->eliminar_historial($_REQUEST["id"], $_REQUEST["inventario_id"]);

	echo json_encode($datos);

?>
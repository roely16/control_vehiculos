<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/CuotaController.php';

	$cuota_ctrl = new CuotaController();

	$datos = $cuota_ctrl->eliminar_cuota($_REQUEST["id"], $_REQUEST["inventario_id"]);

	echo json_encode($datos);

?>
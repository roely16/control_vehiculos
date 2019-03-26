<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/CuotaController.php';

	$cuota_ctrl = new CuotaController();

	$datos = $cuota_ctrl->obtener_fechas_cuotas($_REQUEST["id"]);

	echo json_encode($datos);

	
?>
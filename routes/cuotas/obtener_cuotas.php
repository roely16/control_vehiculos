<?php  
	
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/CuotaController.php';

	$cuota_ctrl = new CuotaController();

	$datos = $cuota_ctrl->obtener_todas_cuotas();

	echo json_encode($datos);

?>
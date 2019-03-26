<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Bitacora_EventosController.php';

	$bitacora_ctrl = new Bitacora_EventosController();
	$usuario = $bitacora_ctrl->obtener_usuario();	

	$evento = "El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha emitido un vale a pesar de que existen vales sin entregar";

	$bitacora_ctrl->registrar_evento($evento, $_REQUEST["id"]);

	$bitacora = $bitacora_ctrl->obtener_eventos($_REQUEST["id"]);

	echo json_encode($bitacora);

?>
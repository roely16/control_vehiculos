<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$con_vale = new valeController();

	$data = $con_vale->entrega_vale($_POST);

	echo json_encode($data);

?>

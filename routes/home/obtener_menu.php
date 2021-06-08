<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/HomeController.php';

	$home_ctrl = new HomeController();

	$datos = $home_ctrl->obtenerMenu();

	echo json_encode($datos);

?>

<?php  

	require_once('../../controllers/DocumentosController.php');
	
	$documento_ctrl = new DocumentosController();
	$data = $documento_ctrl->mover_documento($_FILES);

	echo json_encode($data);

?>
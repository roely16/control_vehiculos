<?php  
	
	/*
	if (isset($_GET['id']) && intval($_GET['id'])) {
		
		require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/mail/mail.php';

		$mail = new Mail();

		$mail->send_mail('hchur@muniguate.com', 'Prueba', '<h1>Prueba</h1>');

	}
	*/

	
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/mail/mail.php';

	$mail = new Mail();

	$mail->send_mail('hchur@muniguate.com', 'Prueba', '<h1>Prueba</h1>');
	

?>
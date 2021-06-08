<?php 

    require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/mail/mail.php';
    
    $mail = new Mail();

	$mail->send_mail('gerson.roely@gmail.com', 'Finalización de gestión', 'Test');
?>
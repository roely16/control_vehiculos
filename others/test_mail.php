<?php  

	include $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/mail/mail.php';

	$mail = new Mail();

	$text = "La gestion No. 123 se encuentra en RECHAZADA<br>
	            Para ver detalles por favor ingrese al portal de recursos humanos <br>
			    http://172.23.25.31/RecursosHumanos/ con su usuario y clave, luego siga los siguientes pasos:<br>
			    <ul>
			    <li>Seleccionar modulo de Gestiones</li>
			    <li>Click en Consulta de Gestiones</li>
			    <li>Buscar por la palabra 'Rechazada'</li>
			    <li>Click en detalles en la gestion buscada</li>				
			    <li>Click en movimiento interno para ver el usuario que la rechazo o en el historial de la gestion</li>						
			    </ul><br>";

	var_dump($mail->send_mail("hchur@muniguate.com", "Rechazo de gestión", $text));

	

?>
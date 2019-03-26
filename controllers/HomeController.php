<?php  
	
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Bitacora_EventosController.php';

	class HomeController{

		function solicitudes_pendientes(){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();

			$query = "SELECT COUNT(*) AS PENDIENTES FROM ADM_GESTIONES WHERE ADM_GESTIONES.TIPOGESTION = 1 AND (ADM_GESTIONES.STATUS = 4 OR ADM_GESTIONES.STATUS = 0)";

			$stid = oci_parse($conn, $query);

			oci_execute($stid);

			$pendientes = oci_fetch_object($stid);

			$query = "SELECT COUNT(*) AS PENDIENTES FROM ADM_GESTIONES WHERE ADM_GESTIONES.TIPOGESTION = 5 AND (ADM_GESTIONES.STATUS = 4 OR ADM_GESTIONES.STATUS = 0)";

			$stid = oci_parse($conn, $query);

			oci_execute($stid);

			$pendientes_m = oci_fetch_object($stid);

			return array($pendientes, $pendientes_m, $usuario);

		}

	}

?>
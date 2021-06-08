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

			$query = "SELECT COUNT(*) AS PENDIENTES FROM ADM_GESTIONES WHERE ADM_GESTIONES.TIPOGESTION = 8 AND (ADM_GESTIONES.STATUS = 4 OR ADM_GESTIONES.STATUS = 0)";

			$stid = oci_parse($conn, $query);

			oci_execute($stid);

			$pendientes_m = oci_fetch_object($stid);
            $suma_pendientes = $pendientes_m->PENDIENTES;
            
            $query = "SELECT COUNT(*) AS PENDIENTES FROM ADM_GESTIONES_CORRECTIVAS WHERE ESTADO = 0";
            
            $stid = oci_parse($conn, $query);

			oci_execute($stid);

			$pendientes_m = oci_fetch_object($stid);
            
            $suma_pendientes = $suma_pendientes + $pendientes_m->PENDIENTES;
            
            $pendientes_m = array("PENDIENTES" => $suma_pendientes);
            
			return array($pendientes, $pendientes_m, $usuario);

		}

		function obtenerMenu(){

			if(!isset($_SESSION))
		    {
		    	session_start();
		    }

			$nit = $_SESSION['nit'];

			$dbc = new Oracle();
			$conn = $dbc->connect();
			
			$query = "	SELECT T2.*
						FROM ADM_ACCESOS_VALES T1
						INNER JOIN ADM_MENU_VALES T2
						ON T1.ID_ACCESO = T2.ID
						WHERE T1.USUARIO = '$nit'
						AND T2.TIPO = 1
						ORDER BY T1.ID_ACCESO";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$accesos = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

				$accesos [] = $data;

			}

			return $accesos;

		}

	}

?>

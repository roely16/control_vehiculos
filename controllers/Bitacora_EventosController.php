<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';

	class Bitacora_EventosController{

		function registrar_evento($evento, $inventarioid){

			date_default_timezone_set('America/Guatemala');

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$hora = date('h:i:s A');
			$fecha = date('d/m/Y');

			$query = "INSERT INTO ADM_BITACORA_VEHICULOS(FECHA, HORA, EVENTO, INVENTARIOID) VALUES ('$fecha', '$hora', '$evento', $inventarioid)";

			$stid = oci_parse($conn, $query);

			oci_execute($stid);

			return 1;
		}

		function obtener_eventos($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM ADM_BITACORA_VEHICULOS WHERE INVENTARIOID = $id ORDER BY BITACORAID DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$b_eventos = array();
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$b_eventos[] = $data;
			}

			return $b_eventos;
		}

		function obtener_usuario(){

			if(!isset($_SESSION))
		    {
		    	session_start();
		    }

			$nit = $_SESSION['nit'];

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT RH_EMPLEADOS.*, ADM_ROLES.* FROM RH_EMPLEADOS
			INNER JOIN ADM_ROLES ON RH_EMPLEADOS.NIT = ADM_ROLES.EMPLEADONIT WHERE RH_EMPLEADOS.NIT = '$nit'";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$usuario = oci_fetch_object($stid);

			return $usuario;
		}
	}

?>

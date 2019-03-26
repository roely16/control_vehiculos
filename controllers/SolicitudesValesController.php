<?php  
	
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Bitacora_EventosController.php';

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/mail/mail.php';

	class SolicitudesValesController{

		function mostrar_solicitudes_pendientes(){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT ADM_GESTIONES.GESTIONID, TO_CHAR(ADM_GESTIONES.FECHA, 'dd/mm/yyyy HH24:MI:SS') AS FECHA, 
			ADM_GESTIONES.INVENTARIOID, ADM_GESTIONES.STATUS,RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, RH_EMPLEADOS.NIT, 
			ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.TIPO, ADM_FICHA_VEHICULOS.MARCA, ADM_FICHA_VEHICULOS.MODELO, EQP_INVENTARIO.ACTIVO 
			FROM ADM_GESTIONES INNER JOIN RH_EMPLEADOS  ON ADM_GESTIONES.EMPLEADOID = RH_EMPLEADOS.NIT
			INNER JOIN ADM_FICHA_VEHICULOS ON ADM_GESTIONES.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
			INNER JOIN EQP_INVENTARIO ON ADM_FICHA_VEHICULOS.INVENTARIOID = EQP_INVENTARIO.INVENTARIOID
			WHERE ADM_GESTIONES.TIPOGESTION = 1 AND (ADM_GESTIONES.STATUS = 4 OR ADM_GESTIONES.STATUS = 0)
			ORDER BY ADM_GESTIONES.GESTIONID DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$solicitudes_pendientes = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$solicitudes_pendientes[] = $data;

			}

			$query = "SELECT ADM_GESTIONES.GESTIONID, TO_CHAR(ADM_GESTIONES.FECHA, 'dd/mm/yyyy HH24:MI:SS') AS FECHA, 
                ADM_GESTIONES.INVENTARIOID, ADM_GESTIONES.STATUS,RH_EMPLEADOS.NOMBRE, ADM_GESTIONES.DETALLE, RH_EMPLEADOS.APELLIDO, RH_EMPLEADOS.NIT, 
                ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.TIPO, ADM_FICHA_VEHICULOS.MARCA, ADM_FICHA_VEHICULOS.MODELO, EQP_INVENTARIO.ACTIVO AS ESTADO_VEHICULO 
                FROM ADM_GESTIONES INNER JOIN RH_EMPLEADOS  ON ADM_GESTIONES.EMPLEADOID = RH_EMPLEADOS.NIT
                INNER JOIN ADM_FICHA_VEHICULOS ON ADM_GESTIONES.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
                INNER JOIN EQP_INVENTARIO ON ADM_FICHA_VEHICULOS.INVENTARIOID = EQP_INVENTARIO.INVENTARIOID
                WHERE ADM_GESTIONES.TIPOGESTION = 5 AND (ADM_GESTIONES.STATUS = 4 OR ADM_GESTIONES.STATUS = 0)
                ORDER BY ADM_GESTIONES.GESTIONID DESC";

            $stid = oci_parse($conn, $query);
			oci_execute($stid);

			$solicitudes_mantenimiento_pendientes = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$solicitudes_mantenimiento_pendientes[] = $data;

			}

			return array($solicitudes_pendientes, $solicitudes_mantenimiento_pendientes);
		}

		function detalles_solicitud($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT ADM_GESTIONES.GESTIONID, TO_CHAR(ADM_GESTIONES.FECHA, 'dd/mm/yyyy HH24:MI:SS') AS FECHA, ADM_GESTIONES.DETALLE , RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, RH_EMPLEADOS.NIT, RH_EMPLEADOS.EMAILMUNI FROM 
				ADM_GESTIONES 
				INNER JOIN RH_EMPLEADOS 
				ON ADM_GESTIONES.EMPLEADOID = RH_EMPLEADOS.NIT
				WHERE ADM_GESTIONES.GESTIONID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$gestion = oci_fetch_object($stid);

			return $gestion;
		}

		function gestiones_vales_pendientes(){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT ADM_GESTIONES.GESTIONID, TO_CHAR(ADM_GESTIONES.FECHA, 'dd/mm/yyyy HH24:MI:SS') AS FECHA, 
				ADM_GESTIONES.INVENTARIOID, ADM_GESTIONES.STATUS,RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, RH_EMPLEADOS.NIT, 
				ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.TIPO, ADM_FICHA_VEHICULOS.MARCA, ADM_FICHA_VEHICULOS.MODELO 
				FROM ADM_GESTIONES INNER JOIN RH_EMPLEADOS  ON ADM_GESTIONES.EMPLEADOID = RH_EMPLEADOS.NIT
				INNER JOIN ADM_FICHA_VEHICULOS ON ADM_GESTIONES.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
				WHERE ADM_GESTIONES.TIPOGESTION = 1 AND (ADM_GESTIONES.STATUS = 4 OR ADM_GESTIONES.STATUS = 0)
				ORDER BY ADM_GESTIONES.GESTIONID DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$solicitudes_pendientes = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$solicitudes_pendientes[] = $data;

			}

			return $solicitudes_pendientes;
		}

		function gestiones_mantenimientos_pendientes(){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT ADM_GESTIONES.GESTIONID, TO_CHAR(ADM_GESTIONES.FECHA, 'dd/mm/yyyy HH24:MI:SS') AS FECHA, 
				ADM_GESTIONES.INVENTARIOID, ADM_GESTIONES.STATUS,RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, RH_EMPLEADOS.NIT, 
				ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.TIPO, ADM_FICHA_VEHICULOS.MARCA, ADM_FICHA_VEHICULOS.MODELO 
				FROM ADM_GESTIONES INNER JOIN RH_EMPLEADOS  ON ADM_GESTIONES.EMPLEADOID = RH_EMPLEADOS.NIT
				INNER JOIN ADM_FICHA_VEHICULOS ON ADM_GESTIONES.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
				WHERE ADM_GESTIONES.TIPOGESTION = 5 AND (ADM_GESTIONES.STATUS = 4 OR ADM_GESTIONES.STATUS = 0)
				ORDER BY ADM_GESTIONES.GESTIONID DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$solicitudes_pendientes = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$solicitudes_pendientes[] = $data;

			}

			return $solicitudes_pendientes;
		}

		function cancelar_gestion($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			date_default_timezone_set('America/Guatemala');
			$fecha_fin = date('d/m/Y H:i:s');

			$query = "UPDATE ADM_GESTIONES SET STATUS = 3 WHERE GESTIONID = $id";
			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			/* Cambiar estado en Workflow */
			$query = "UPDATE ADM_WORKFLOW SET FECHARECHAZO = TO_DATE('$fecha_fin', 'DD/MM/YYYY HH24:MI:SS'), ESTADO = 'RECHAZADA' WHERE GESTIONID = $id";
			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$usuario = $this->detalles_solicitud($id);

			$text = "La gestión No. ".$id." se encuentra RECHAZADA<br>
	            Para ver detalles por favor ingrese al portal de recursos humanos <br>
			    http://172.23.25.31/RecursosHumanos/ con su usuario y clave, luego siga los siguientes pasos:<br>
			    <ul>
			    <li>Seleccionar modulo de Gestiones</li>
			    <li>Click en Consulta de Gestiones</li>
			    <li>Buscar por la palabra 'Rechazada'</li>
			    <li>Click en detalles en la gestion buscada</li>				
			    <li>Click en movimiento interno para ver el usuario que la rechazo o en el historial de la gestion</li>						
			    </ul><br>";

			/* Enviar correo */
			$mail = new Mail();

			$mail->send_mail($usuario->EMAILMUNI, 'Rechazo de gestión', $text);

			$solicitudes_pendientes = $this->gestiones_vales_pendientes();

			return array($solicitudes_pendientes, $usuario);
		}

		function cancelar_gestion_m($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "UPDATE ADM_GESTIONES SET STATUS = 3 WHERE GESTIONID = $id";

			$stid = oci_parse($conn, $query);

			oci_execute($stid);

			$usuario = $this->detalles_solicitud($id);
			$text = "La gestión No. ".$id." se encuentra RECHAZADA<br>
	            Para ver detalles por favor ingrese al portal de recursos humanos <br>
			    http://172.23.25.31/RecursosHumanos/ con su usuario y clave, luego siga los siguientes pasos:<br>
			    <ul>
			    <li>Seleccionar modulo de Gestiones</li>
			    <li>Click en Consulta de Gestiones</li>
			    <li>Buscar por la palabra 'Rechazada'</li>
			    <li>Click en detalles en la gestion buscada</li>				
			    <li>Click en movimiento interno para ver el usuario que la rechazo o en el historial de la gestion</li>						
			    </ul><br>";

			/* Enviar correo */
			$mail = new Mail();

			$mail->send_mail($usuario->EMAILMUNI, 'Rechazo de gestión', $text);

			$solicitudes_pendientes = $this->gestiones_mantenimientos_pendientes();

			return $solicitudes_pendientes;
		}

		function obtener_vales($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT ADM_VALES.*, RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, RH_EMPLEADOS.NIT FROM ADM_VALES INNER JOIN RH_EMPLEADOS ON ADM_VALES.RESPONSABLE = RH_EMPLEADOS.NIT WHERE INVENTARIOID = $id AND NO_GESTION = 0 AND ESTADO = 5 ORDER BY ADM_VALES.VALEID DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$vales = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {
			
				$vales[] = $data;

			}

			return $vales;
		}

		function unir_con_vale($request){

			$valeid = $request["VALEID"];
			$gestionid = $request["GESTIONID"];

			/* Colocar ID de gestión en vale */
			$query = "UPDATE";

			/* Cerrar la gestión */
			$query = "UPDATE";

			/* Cerrar gestión en workflow */
			$query = "UPDATE";
		}

	}

?>
<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';

	class Mantenimiento_VehiculoController{

		protected $conn;

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();
		}

		function registrar_mantenimiento($request){

			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yyyy'";
			$stid = oci_parse($this->conn, $query_sysdate);
			oci_execute($stid);

			$fecha = $request["FECHA"];
			$hora = $request["HORA"];
			$inventario_id = $request["INVENTARIOID"];
			$tipo_mantenimiento = $request["TIPO_MANTENIMIENTO_ID"];
			$km_actual = $request["KILOMETRAJE_ACTUAL"];
			$responsable = $request["RESPONSABLE"];
			$gestion_id = $request["GESTIONID"];
			$revisiones = $request["REVISIONES"];
			$otras_revisiones = $request["OTROS_TRABAJOS"];
			$proveedor_id = $request["PROVEEDORID"];

			if ($gestion_id != "") {

				$query = "UPDATE ADM_GESTIONES SET STATUS = 5 WHERE GESTIONID = $gestion_id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);
			}

			$query = "INSERT INTO ADM_MANTENIMIENTOS_VEHICULOS (INVENTARIOID, TIPO_MANTENIMIENTO_ID, KILOMETRAJE_ACTUAL, FECHA, HORA, RESPONSABLE, GESTIONID, ESTADO, PROVEEDORID) VALUES ('$inventario_id', '$tipo_mantenimiento', '$km_actual', '$fecha', TO_DATE('$hora', 'HH24:MI:SS'), '$responsable', '$gestion_id', 0, $proveedor_id)";

			$stid = oci_parse($this->conn, $query);

			oci_execute($stid);

			$query = "SELECT MAX(MANTENIMIENTOID) AS MANTENIMIENTOID FROM ADM_MANTENIMIENTOS_VEHICULOS
						ORDER BY MANTENIMIENTOID DESC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$result = oci_fetch_array($stid);
			$mantenimiento_id = $result["MANTENIMIENTOID"];

			/* Registro de revisiones */
			foreach ($revisiones as $revision) {

				$query = "INSERT INTO ADM_DETALLES_MANTENIMIENTO (REVISIONID, MANTENIMIENTOID) VALUES ($revision, $mantenimiento_id)";
				$stid = oci_parse($this->conn, $query);

				oci_execute($stid);
			}

			/* Registro de otras revisiones */
			foreach ($otras_revisiones as $otra_revision) {

				$query = "INSERT INTO ADM_DETALLES_MANTENIMIENTO (MANTENIMIENTOID, NOMBRE) VALUES ($mantenimiento_id, '$otra_revision')";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			$mantenimientos = $this->mostrar_mantenimientos($inventario_id);

			/* Cambiar estado del vehiculo */

			return $mantenimientos;
		}

		function detalles_mantenimiento($id){

			$query = "SELECT * FROM ADM_MANTENIMIENTOS_VEHICULOS WHERE MANTENIMIENTOID = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$mantenimiento = oci_fetch_object($stid);
			$mantenimiento_id = $mantenimiento->MANTENIMIENTOID;

			if ($mantenimiento->ESTADO > 1) {

				if ($mantenimiento->TIPO_MANTENIMIENTO_ID < 4) {

					$query = "SELECT ADM_MANTENIMIENTOS_VEHICULOS.*, ADM_TIPOS_MANTENIMIENTO.NOMBRE AS NOMBRE_PROXIMO_MANTENIMIENTO, ADM_PROVEEDORES.NOMBRE AS NOMBRE_PROVEEDOR FROM ADM_MANTENIMIENTOS_VEHICULOS INNER JOIN ADM_TIPOS_MANTENIMIENTO ON ADM_MANTENIMIENTOS_VEHICULOS.TIPO_PROXIMO_MANTENIMIENTO = ADM_TIPOS_MANTENIMIENTO.ID INNER JOIN ADM_PROVEEDORES ON ADM_MANTENIMIENTOS_VEHICULOS.PROVEEDORID = ADM_PROVEEDORES.PROVEEDORID WHERE MANTENIMIENTOID = $id";

				}else{

					$query = "SELECT ADM_MANTENIMIENTOS_VEHICULOS.*, ADM_PROVEEDORES.NOMBRE AS NOMBRE_PROVEEDOR FROM ADM_MANTENIMIENTOS_VEHICULOS INNER JOIN ADM_PROVEEDORES ON ADM_MANTENIMIENTOS_VEHICULOS.PROVEEDORID = ADM_PROVEEDORES.PROVEEDORID WHERE MANTENIMIENTOID = $id";

				}

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$mantenimiento = oci_fetch_object($stid);
				$mantenimiento_id = $mantenimiento->MANTENIMIENTOID;

			}

			/* Nombres de los responsables */

			if ($mantenimiento->ESTADO == 0) {

				$query = "SELECT CONCAT(CONCAT(NOMBRE, ' '), APELLIDO) AS RESPONSABLE_1 FROM RH_EMPLEADOS WHERE NIT = '$mantenimiento->RESPONSABLE'";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);
				$responsable_1 = oci_fetch_object($stid);

			}else if($mantenimiento->ESTADO == 1 || $mantenimiento->ESTADO == 2 || $mantenimiento->ESTADO == 3){

				$query = "SELECT CONCAT(CONCAT(NOMBRE, ' '), APELLIDO) AS RESPONSABLE_1 FROM RH_EMPLEADOS WHERE NIT = '$mantenimiento->RESPONSABLE'";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);
				$responsable_1 = oci_fetch_object($stid);

				$query = "SELECT CONCAT(CONCAT(NOMBRE, ' '), APELLIDO) AS RESPONSABLE_2 FROM RH_EMPLEADOS WHERE NIT = '$mantenimiento->RESPONSABLE_ENTREGA'";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);
				$responsable_2 = oci_fetch_object($stid);

			}

			/* Revisiones predeterminadas del mantenimiento */

			$query = "SELECT ADM_DETALLES_MANTENIMIENTO.DETALLEID, ADM_REVISIONES_MANTENIMIENTO.NOMBRE, ADM_DETALLES_MANTENIMIENTO.REALIZADO
			FROM ADM_DETALLES_MANTENIMIENTO
			INNER JOIN ADM_REVISIONES_MANTENIMIENTO
			ON ADM_DETALLES_MANTENIMIENTO.REVISIONID = ADM_REVISIONES_MANTENIMIENTO.ID
			WHERE ADM_DETALLES_MANTENIMIENTO.MANTENIMIENTOID = $mantenimiento_id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$revisiones = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$revisiones [] = $data;

			}

			/* Otras revisiones del mantenimiento */

			$query = "SELECT DETALLEID, NOMBRE, MANTENIMIENTOID, REALIZADO FROM ADM_DETALLES_MANTENIMIENTO
			WHERE MANTENIMIENTOID = $mantenimiento_id AND NOMBRE IS NOT NULL";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$otras_revisiones = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$otras_revisiones [] = $data;
			}

			/* Evaluacion del proveedor */
			if ($mantenimiento->ESTADO == 3) {

				$query = "SELECT ADM_CRITERIOS_EVALUACION.NOMBRE, ADM_CRITERIOS_EVALUACION.MAXIMO, ADM_EVALUACION_MANTENIMIENTO.CALIFICACION FROM ADM_EVALUACION_MANTENIMIENTO INNER JOIN ADM_CRITERIOS_EVALUACION ON ADM_EVALUACION_MANTENIMIENTO.CRITERIO_EVALUACION_ID = ADM_CRITERIOS_EVALUACION.ID WHERE MANTENIMIENTOID = $mantenimiento_id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$evaluacion = array();

				while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

					$evaluacion [] = $data;

				}

			}

			if ($mantenimiento->ESTADO == 0) {

				return array($mantenimiento, $revisiones, $otras_revisiones, $responsable_1->RESPONSABLE_1);

			}else if($mantenimiento->ESTADO == 1 || $mantenimiento->ESTADO == 2){

				return array($mantenimiento, $revisiones, $otras_revisiones, $responsable_1->RESPONSABLE_1, $responsable_2->RESPONSABLE_2);

			}else if ($mantenimiento->ESTADO == 3) {

				return array($mantenimiento, $revisiones, $otras_revisiones, $responsable_1->RESPONSABLE_1, $responsable_2->RESPONSABLE_2, $evaluacion);

			}
		}

		function editar_mantenimiento($request){

			$revisiones_realizadas = $request["REVISIONES_REALIZADAS"];
			$otras_revisiones_realizadas = $request["OTRAS_REVISIONES_REALIZADAS"];
			$mantenimiento_id = $request["MANTENIMIENTOID"];
			$inventario_id = $request["INVENTARIOID"];
			$fecha_entrega = $request["FECHA_ENTREGA"];
			$responsable_entrega = $request["RESPONSABLE_ENTREGA"];
			$observaciones_entrega = $request["OBSERVACIONES_ENTREGA"];

			/* Revisiones predeterminadas */
			foreach ($revisiones_realizadas as $revision) {

				$query = "UPDATE ADM_DETALLES_MANTENIMIENTO SET REALIZADO = 1 WHERE DETALLEID = $revision";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			/* Otras revisiones */
			foreach ($otras_revisiones_realizadas as $otra_revision) {

				$query = "UPDATE ADM_DETALLES_MANTENIMIENTO SET REALIZADO = 1 WHERE DETALLEID = $otra_revision";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yyyy'";
			$stid = oci_parse($this->conn, $query_sysdate);
			oci_execute($stid);

			$query = "UPDATE ADM_MANTENIMIENTOS_VEHICULOS SET ESTADO = 1, RESPONSABLE_ENTREGA = '$responsable_entrega', FECHA_ENTREGA = '$fecha_entrega', OBSERVACIONES_ENTREGA = '$observaciones_entrega' WHERE MANTENIMIENTOID = $mantenimiento_id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$mantenimientos = $this->mostrar_mantenimientos($inventario_id);

			return array($mantenimientos);
		}

		function eliminar_mantenimiento($id, $inventario_id){

			$query = "DELETE FROM ADM_MANTENIMIENTOS_VEHICULOS WHERE MANTENIMIENTOID = $id";

			$stid = oci_parse($this->conn, $query);

			oci_execute($stid);

			$mantenimientos = $this->mostrar_mantenimientos($inventario_id);

			return $mantenimientos;
		}

		function mostrar_mantenimientos($id){

			$query = "SELECT ADM_MANTENIMIENTOS_VEHICULOS.MANTENIMIENTOID, ADM_MANTENIMIENTOS_VEHICULOS.INVENTARIOID, ADM_MANTENIMIENTOS_VEHICULOS.FECHA,
				TO_CHAR(ADM_MANTENIMIENTOS_VEHICULOS.HORA, 'HH24:MI:SS') AS HORA, ADM_MANTENIMIENTOS_VEHICULOS.TIPO_MANTENIMIENTO_ID, ADM_MANTENIMIENTOS_VEHICULOS.ESTADO, RH_EMPLEADOS.NOMBRE,
				RH_EMPLEADOS.APELLIDO, ADM_PROVEEDORES.NOMBRE AS NOMBRE_PROVEEDOR
				FROM ADM_MANTENIMIENTOS_VEHICULOS
				INNER JOIN RH_EMPLEADOS
				ON ADM_MANTENIMIENTOS_VEHICULOS.RESPONSABLE = RH_EMPLEADOS.NIT
				INNER JOIN ADM_PROVEEDORES
				ON ADM_MANTENIMIENTOS_VEHICULOS.PROVEEDORID = ADM_PROVEEDORES.PROVEEDORID
				WHERE INVENTARIOID = $id ORDER BY ADM_MANTENIMIENTOS_VEHICULOS.FECHA DESC";

			$stid = oci_parse($this->conn, $query);

			oci_execute($stid);

			$mantenimientos = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$mantenimientos[] = $data;

			}

			return $mantenimientos;
		}

		function mostrar_todos_mantenimientos(){
		}

		function tipos_mantenimientos(){

			$query = "SELECT * FROM ADM_TIPOS_MANTENIMIENTO ORDER BY ID ASC";

			$stid = oci_parse($this->conn, $query);

			oci_execute($stid);

			$tipos_mantenimiento = array();

			while($data = oci_fetch_array($stid,OCI_ASSOC)){

				$tipos_mantenimiento[] = $data;

			}

			$query = "SELECT ADM_ROLES.EMPLEADONIT, RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO
					FROM ADM_ROLES
					INNER JOIN RH_EMPLEADOS
					ON ADM_ROLES.EMPLEADONIT = RH_EMPLEADOS.NIT
					WHERE ADM_ROLES.PILOTO = 1";

			$stid = oci_parse($this->conn, $query);

			oci_execute($stid);

			$responsables = array();

			while($data = oci_fetch_array($stid,OCI_ASSOC)){

				$responsables[] = $data;

			}

			$query = "SELECT * FROM ADM_PROVEEDORES WHERE TIPO = 1";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$proveedores = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$proveedores [] = $data;

			}

			return array($tipos_mantenimiento, $responsables, $proveedores);
		}

		function detalle_tipo_mantenimiento($id){

			$query = "SELECT * FROM ADM_REVISIONES_MANTENIMIENTO WHERE TIPO_MANTENIMIENTO = $id ORDER BY ID ASC";

			$stid = oci_parse($this->conn, $query);

			oci_execute($stid);

			$detalles_tipo_mantenimiento = array();

			while($data = oci_fetch_array($stid,OCI_ASSOC)){

				$data["FRECUENCIA"] = 1;

				$detalles_tipo_mantenimiento[] = $data;

			}

			return $detalles_tipo_mantenimiento;
		}

		function obtener_proveedores(){

			$query = "SELECT * FROM ADM_PROVEEDORES WHERE TIPO = 1";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$proveedores = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$proveedores [] = $data;

			}

			return $proveedores;
		}

		function registrarFactura($request){

			$mantenimiento_id = $request["MANTENIMIENTOID"];
			$no_factura = $request["NO_FACTURA"];
			$observaciones = $request["OBSERVACIONES"];
			$valor_factura = $request["VALOR_FACTURA"];
			$inventario_id = $request["INVENTARIOID"];
			$tipo_mantenimiento_id = $request["TIPO_MANTENIMIENTO_ID"];

			/* Si es un mantenimiento PREVENTIVO */

			if ($tipo_mantenimiento_id < 4) {

				$km_proximo = $request["KILOMETRAJE_PROXIMO"];
				$proximo_servicio = $request["PROXIMO_SERVICIO"];

				$query = "UPDATE ADM_MANTENIMIENTOS_VEHICULOS SET ESTADO = 2, KILOMETRAJE_PROXIMO = $km_proximo, TIPO_PROXIMO_MANTENIMIENTO = $proximo_servicio, OBSERVACIONES = '$observaciones', NO_FACTURA = $no_factura, VALOR_FACTURA = $valor_factura WHERE MANTENIMIENTOID = $mantenimiento_id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$mantenimientos = $this->mostrar_mantenimientos($inventario_id);

				/* Actualizar kilometraje de proximo mantenimiento */
				$query = "UPDATE ADM_FICHA_VEHICULOS SET KM_SERVICIO = $km_proximo, TIPO_PROXIMO_SERVICIO = $proximo_servicio WHERE INVENTARIOID = $inventario_id";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				return array($mantenimientos, $km_proximo);

			}else if($tipo_mantenimiento_id > 3){

				$query = "UPDATE ADM_MANTENIMIENTOS_VEHICULOS SET ESTADO = 2, OBSERVACIONES = '$observaciones', NO_FACTURA = $no_factura, VALOR_FACTURA = $valor_factura WHERE MANTENIMIENTOID = $mantenimiento_id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$mantenimientos = $this->mostrar_mantenimientos($inventario_id);

				return array($mantenimientos);

			}
		}

		function criterios_evaluacion(){

			$query = "SELECT * FROM ADM_CRITERIOS_EVALUACION WHERE TIPO_CRITERIO = 1";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$criterios = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$criterios [] = $data;
			}

			return $criterios;
		}

		function registrar_evaluacion($request){

			//return $request;
			$mantenimiento_id = $request[1]["MANTENIMIENTOID"];
			$inventario_id = $request[1]["INVENTARIOID"];

			foreach ($request[0] as $evaluacion) {

				$criterio_evaluacion_id = $evaluacion["ID"];
				$calificacion = $evaluacion["CALIFICACION"];

				$query = "INSERT INTO ADM_EVALUACION_MANTENIMIENTO (MANTENIMIENTOID, CRITERIO_EVALUACION_ID, CALIFICACION) VALUES ($mantenimiento_id, $criterio_evaluacion_id, $calificacion)";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			/* Actualizar estado del mantenimiento */
			$query = "UPDATE ADM_MANTENIMIENTOS_VEHICULOS SET ESTADO = 3 WHERE MANTENIMIENTOID = $mantenimiento_id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			/* Obtener mantenimientos */
			$mantenimientos = $this->mostrar_mantenimientos($inventario_id);

			return array($mantenimientos);
		}

	}

?>

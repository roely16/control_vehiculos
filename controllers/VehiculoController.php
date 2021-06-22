<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/models/Vehiculo.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/models/Eqp_Inventario.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Bitacora_EventosController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/HistorialController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/DocumentosController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Mantenimiento_VehiculoController.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/RepuestosController.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/CorrectivasController.php';

	class VehiculoController{

		function listar_vehiculos(){

			/* Obtener usuario */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$nit = $usuario->NIT;

			$query = "SELECT EQP_INVENTARIO.INVENTARIOID, ADM_FICHA_VEHICULOS.FICHAVEHICULOID, ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.TIPO,
			 ADM_FICHA_VEHICULOS.MARCA, ADM_FICHA_VEHICULOS.MODELO, ADM_FICHA_VEHICULOS.LINEA, ADM_FICHA_VEHICULOS.COLOR,
			 ADM_FICHA_VEHICULOS.TIPO_COMBUSTIBLE, ADM_FICHA_VEHICULOS.NO_MOTOR, ADM_FICHA_VEHICULOS.NO_CHASIS, ADM_FICHA_VEHICULOS.TARJETA_CIRC,
			 ADM_FICHA_VEHICULOS.KM_ACTUAL, ADM_FICHA_VEHICULOS.KM_SERVICIO, ADM_FICHA_VEHICULOS.ACTIVIDAD, ADM_FICHA_VEHICULOS.KM_RECORDATORIO
			FROM EQP_INVENTARIO
			INNER JOIN ADM_FICHA_VEHICULOS
			ON EQP_INVENTARIO.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
			WHERE EQP_INVENTARIO.INVENTARIOID IN (SELECT VEHICULOID FROM ADM_ADMINISTRADOR_VEHICULO WHERE ADMINISTRADOR = '$nit')";

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$json = array();

			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$json[] = $data;
			}

			$ruta_servidor = $_SERVER['DOCUMENT_ROOT'];

			return array($json, $usuario, $ruta_servidor);
		}

		function listar_vehiculos_cuota(){

			/* Obtener usuario */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$nit = $usuario->NIT;

			$query = "SELECT EQP_INVENTARIO.INVENTARIOID, ADM_FICHA_VEHICULOS.FICHAVEHICULOID, ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.TIPO,
			 ADM_FICHA_VEHICULOS.MARCA, ADM_FICHA_VEHICULOS.MODELO, ADM_FICHA_VEHICULOS.LINEA, ADM_FICHA_VEHICULOS.COLOR,
			 ADM_FICHA_VEHICULOS.TIPO_COMBUSTIBLE, ADM_FICHA_VEHICULOS.NO_MOTOR, ADM_FICHA_VEHICULOS.NO_CHASIS, ADM_FICHA_VEHICULOS.TARJETA_CIRC,
			 ADM_FICHA_VEHICULOS.KM_ACTUAL, ADM_FICHA_VEHICULOS.KM_SERVICIO, ADM_FICHA_VEHICULOS.ACTIVIDAD
			FROM EQP_INVENTARIO
			INNER JOIN ADM_FICHA_VEHICULOS
			ON EQP_INVENTARIO.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
			WHERE ADM_FICHA_VEHICULOS.ASIGNAR_CUOTA = 'S'";

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$json = array();

			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$json[] = $data;
			}

			$ruta_servidor = $_SERVER['DOCUMENT_ROOT'];

			return array($json, $usuario, $ruta_servidor);

		}

		function mostrar_vehiculo($id){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT EQP_INVENTARIO.INVENTARIOID, EQP_INVENTARIO.ACTIVO, ADM_FICHA_VEHICULOS.FICHAVEHICULOID, ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.TIPO,
				 ADM_FICHA_VEHICULOS.MARCA, ADM_FICHA_VEHICULOS.MODELO, ADM_FICHA_VEHICULOS.LINEA, ADM_FICHA_VEHICULOS.COLOR,
				 ADM_FICHA_VEHICULOS.TIPO_COMBUSTIBLE, ADM_FICHA_VEHICULOS.NO_MOTOR, ADM_FICHA_VEHICULOS.NO_CHASIS, ADM_FICHA_VEHICULOS.TARJETA_CIRC,
				 ADM_FICHA_VEHICULOS.KM_ACTUAL, ADM_FICHA_VEHICULOS.KM_SERVICIO, ADM_FICHA_VEHICULOS.ACTIVIDAD, RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, ADM_FICHA_VEHICULOS.KM_RECORDATORIO 
				FROM EQP_INVENTARIO
				INNER JOIN ADM_FICHA_VEHICULOS
				ON EQP_INVENTARIO.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
				INNER JOIN RH_EMPLEADOS ON EQP_INVENTARIO.NIT = RH_EMPLEADOS.NIT
				WHERE EQP_INVENTARIO.INVENTARIOID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$vehiculo = oci_fetch_object($stid);

			//Obtener vales del vehiculo
			$vales_ctrl = new ValeController();
			$vales = $vales_ctrl->obtener_vales_vehiculo($id);

			//Obtener vales restantes
			$vales_restantes = $vales_ctrl->vales_restantes();

			//Obtener eventos de la bitacora
			$bitacora_ctrl = new Bitacora_EventosController();
			$b_eventos = $resultado = $bitacora_ctrl->obtener_eventos($id);

			//Obtener historial del vehiculo
			$historial_ctrl = new HistorialController();
			$historial = $historial_ctrl->obtener_historial($id);

			//Obtener cuotas de combustible
			$cuotas = $this->obtener_cuotas_combustible($id);

			//Obtener pilotos
			$pilotos = $this->obtener_pilotos();

			//Obtener documentos
			$documentos_ctrl = new DocumentosController();
			$documentos = $documentos_ctrl->obtener_documentos($id);

			/* Obtener Mantenimientos */
			$mantenimiento_ctrl = new Mantenimiento_VehiculoController();
			$mantenimientos = $mantenimiento_ctrl->mostrar_mantenimientos($id);
            
            /**/
            $repuestos_ctrl = new RepuestosController();
            $repuestos = $repuestos_ctrl->obtener_listado($id);
            
            $correctivas_ctrl = new CorrectivasController();
            $correctivas = $correctivas_ctrl->obtener_listado($id);
            
			return array($vehiculo, $vales, $b_eventos, $historial, $cuotas, $vales_restantes, $pilotos, $documentos, $mantenimientos,$repuestos,$correctivas);
            
            
		}

		function registrar_historial($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$hora_salida = $request["HORA_SALIDA"];
			$hora_entrada = $request["HORA_ENTRADA"];
			$km_salida = $request["KM_SALIDA"];
			$km_entrada = $request["KM_ENTRADA"];
			$responsable = $request["RESPONSABLE"];
			$observaciones = $request["OBSERVACION"];
			$fecha = date('d-m-Y');
			$inventario_id = $request["INVENTARIOID"];

			$query = "INSERT INTO ADM_HISTORIAL_VEHICULOS (FECHA, HORA_SALIDA, KM_SALIDA,
			HORA_ENTRADA, KM_ENTRADA, RESPONSABLE, OBSERVACION, INVENTARIOID) VALUES ('$fecha', '$hora_salida', '$km_salida', '$hora_entrada', '$km_entrada', '$responsable', '$observaciones', $inventario_id)";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			return 1;
		}

		function obtener_historial($id){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM ADM_HISTORIAL_VEHICULOS WHERE INVENTARIOID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$historial = array();
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$historial[] = $data;
			}

			return $historial;
		}

		function obtener_cuotas_combustible($id){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			/* Cambiar Formato de Fecha */
			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yyyy'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query = "SELECT CUOTAID, FECHA_FIN, FECHA_INICIO, CUOTA, INVENTARIOID, ESTADO, RESTANTE, OBSERVACIONES FROM ADM_CUOTAS_COMBUSTIBLE WHERE INVENTARIOID = $id ORDER BY FECHA_FIN DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$cuotas = array();
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{

				$fecha_inicio = $data["FECHA_INICIO"];
				$fecha_fin = $data["FECHA_FIN"];

				$query = "SELECT SUM(CONSUMO) AS CONSUMO FROM ADM_VALES WHERE FECHA
							BETWEEN TO_DATE ('$fecha_inicio', 'dd/mm/yyyy') AND TO_DATE ('$fecha_fin', 'dd/mm/yyyy')
							AND ADM_VALES.INVENTARIOID = $id";

				$stid_ = oci_parse($conn, $query);
				oci_execute($stid_);

				$consumo = oci_fetch_array($stid_);


				if ($consumo["CONSUMO"] == '') {

					$data["CONSUMO"] = 0;
					$data["RESTANTE"] = $data["CUOTA"];


				}else{

					$data["CONSUMO"] = $consumo["CONSUMO"];
					$data["RESTANTE"] = round($data["CUOTA"] - $consumo["CONSUMO"], 2);

				}

				$cuotas[] = $data;
			}


			return $cuotas;
		}

		function obtener_pilotos(){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT CONCAT(CONCAT(RH_EMPLEADOS.NOMBRE, ' '), RH_EMPLEADOS.APELLIDO) AS NOMBRE, RH_EMPLEADOS.NIT
						FROM RH_EMPLEADOS
						INNER JOIN ADM_ROLES
						ON RH_EMPLEADOS.NIT = ADM_ROLES.EMPLEADONIT
						WHERE ADM_ROLES.PILOTO = 1";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$pilotos = array();

			$unwanted_array = array(    'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
                            'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
                            'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
                            'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
                            'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y' );


			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$data["NOMBRE"] = strtr( $data["NOMBRE"], $unwanted_array );

				$pilotos[] = $data;
			}

			return $pilotos;
		}

		function actualizar_kilometraje($id, $kilometraje){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "UPDATE ADM_FICHA_VEHICULOS SET KM_ACTUAL = $kilometraje WHERE INVENTARIOID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);
		}

		function actualizar_kilometraje_2($id, $kilometraje){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "UPDATE ADM_FICHA_VEHICULOS SET KM_ACTUAL = $kilometraje WHERE INVENTARIOID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			//Registrar en la bitacora
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$resultado = $bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " a colocado " .$kilometraje. " como kilometraje actual del vehículo", $id);

			//Retornar bitacora para actualizar la tabla
			$bitacora = $bitacora_ctrl->obtener_eventos($id);

			return array($id, $kilometraje, $bitacora);

		}

		function obtenerTabs(){

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
						AND T2.TIPO = 2
						ORDER BY T1.ID_ACCESO ASC";

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

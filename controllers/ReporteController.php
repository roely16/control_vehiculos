<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Bitacora_EventosController.php';

	class ReporteController{

		function _construct(){
		}

		function reporte_mensual($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			setlocale(LC_TIME, 'es_ES');

			$inicio_mes = date("d/m/Y", strtotime($request["MES"]));
			$fin_mes = date("t/m/Y", strtotime($request["MES"]));

			$mes = strftime("%B %Y", strtotime($request["MES"]));

			$inventario_id = $request["INVENTARIOID"];

			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yy'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query = "SELECT CUOTAID, CUOTA, INVENTARIOID, ESTADO, TO_DATE(FECHA_INICIO, 'dd/mm/yy') AS FECHA_INICIO, TO_DATE(FECHA_FIN, 'dd/mm/yy') AS FECHA_FIN FROM ADM_CUOTAS_COMBUSTIBLE
				WHERE FECHA_INICIO
				BETWEEN TO_DATE('$inicio_mes', 'dd/mm/yyyy') AND TO_DATE('$fin_mes', 'dd/mm/yyyy')
				AND FECHA_FIN
				BETWEEN TO_DATE('$inicio_mes', 'dd/mm/yyyy') AND TO_DATE('$fin_mes', 'dd/mm/yyyy')
				AND INVENTARIOID = $inventario_id
				ORDER BY FECHA_INICIO ASC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$cuotas = array();
			$etiquetas = array();
			$semanas = array();

			$cuotas_grafica = array();
			$consumo_grafica = array();
			$restante_grafica = array();

			$fondo_cuotas = array();
			$borde_cuotas = array();
			$fondo_consumos = array();
			$borde_consumos = array();
			$fondo_restantes = array();
			$borde_restantes = array();

			$total_cuota = 0;
			$total_abastecido = 0;
			$total_restante = 0;
			$i = 1;

			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{

				/* Por cada cuota obtener el total de galones consumidos */
				$fecha_inicio = $data["FECHA_INICIO"];
				$fecha_fin = $data["FECHA_FIN"];

				$query = "SELECT SUM(CONSUMO) FROM ADM_VALES WHERE FECHA
							BETWEEN TO_DATE ('$fecha_inicio', 'dd/mm/yy') AND TO_DATE ('$fecha_fin', 'dd/mm/yy')
							AND ADM_VALES.INVENTARIOID = $inventario_id";

				$stid_ = oci_parse($conn, $query);
				oci_execute($stid_);

				$consumo = oci_fetch_array($stid_);

				$data["CONSUMO"] = round($consumo["SUM(CONSUMO)"], 2);
				$data["SOBRANTE"] = round($data["CUOTA"] - $consumo["SUM(CONSUMO)"], 2);

				$total_cuota = round($total_cuota + $data["CUOTA"], 2);
				$total_abastecido = round($total_abastecido + $data["CONSUMO"], 2);
				$total_restante = round($total_restante + $data["SOBRANTE"], 2);

				$cuotas[] = $data;

				$cuota = str_replace(',', '.', $data["CUOTA"]);
				$fondo_cuotas [] = "rgba(255, 99, 132, 0.2)";
				$borde_cuotas [] = "rgba(255,99,132,1)";
				$cuotas_grafica [] = $cuota;

				$consumo = str_replace(',', '.', $data["CONSUMO"]);
				$fondo_consumos [] = "rgba(54, 162, 235, 0.2)";
				$borde_consumos [] = "rgba(54, 162, 235, 1)";
				$consumo_grafica [] = $consumo;

				$fondo_restantes [] = "rgba(255, 206, 86, 0.2)";
				$borde_restantes [] = "rgba(255, 206, 86, 1)";
				$restante_grafica [] = $cuota - $consumo;

				$semanas [] = 'Semana '.$i;
				$i++;

			}

			$grafica = array(
							array(
								"label" => "Cuota",
								"data" => $cuotas_grafica,
								"backgroundColor" => $fondo_cuotas,
								"borderColor" => $borde_cuotas,
								"borderWidth" => 1),
							array(
								"label" => "Consumo",
								"data" => $consumo_grafica,
								"backgroundColor" => $fondo_consumos,
								"borderColor" => $borde_consumos,
								"borderWidth" => 1),
							array(
								"label" => "Restante",
								"data" => $restante_grafica,
								"backgroundColor" => $fondo_restantes,
								"borderColor" => $borde_restantes,
								"borderWidth" => 1));

			return array($cuotas, $total_cuota, $total_abastecido, $total_restante, $consumo, $semanas, $grafica, $mes);
		}

		function reporte_entradas_salidas($request){

			$inicio_mes = date("d/m/Y", strtotime($request["MES"]));
			$fin_mes = date("t/m/Y", strtotime($request["MES"]));
			$inventario_id = $request["INVENTARIOID"];

			setlocale(LC_TIME, 'es_ES');
			$mes = strftime("%B %Y", strtotime($request["MES"]));

			/* Conectar a BD */
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT TO_CHAR(ADM_HISTORIAL_VEHICULOS.FECHA_SALIDA, 'dd/mm/yyyy') AS FECHA, CONCAT(CONCAT(RH_EMPLEADOS.NOMBRE, ' '), RH_EMPLEADOS.APELLIDO) AS NOMBRE, TO_CHAR(ADM_HISTORIAL_VEHICULOS.HORA_SALIDA, 'HH24:MI:SS') AS HORA_SALIDA, TO_CHAR(ADM_HISTORIAL_VEHICULOS.HORA_ENTRADA, 'HH24:MI:SS') AS HORA_ENTRADA, ADM_HISTORIAL_VEHICULOS.KM_SALIDA, ADM_HISTORIAL_VEHICULOS.KM_ENTRADA, ADM_HISTORIAL_VEHICULOS.OBSERVACION, ADM_HISTORIAL_VEHICULOS.NO_VALE, ADM_HISTORIAL_VEHICULOS.GALONES, ADM_HISTORIAL_VEHICULOS.NO_VIAJES, ADM_HISTORIAL_VEHICULOS.PERSONAS, ADM_HISTORIAL_VEHICULOS.VISITAS_CAMPO, ADM_HISTORIAL_VEHICULOS.JURIDICO, ADM_HISTORIAL_VEHICULOS.TECNICO, ADM_HISTORIAL_VEHICULOS.SIMA, ADM_HISTORIAL_VEHICULOS.IUSI, ADM_HISTORIAL_VEHICULOS.AVISOS_NOT, ADM_HISTORIAL_VEHICULOS.EXPEDIENTES, ADM_HISTORIAL_VEHICULOS.CARTAS, ADM_HISTORIAL_VEHICULOS.UDI, ADM_HISTORIAL_VEHICULOS.ADMINISTRACION,ADM_HISTORIAL_VEHICULOS.REGENCIA, ADM_HISTORIAL_VEHICULOS.OTROS FROM ADM_HISTORIAL_VEHICULOS INNER JOIN RH_EMPLEADOS ON ADM_HISTORIAL_VEHICULOS.RESPONSABLE = RH_EMPLEADOS.NIT WHERE ADM_HISTORIAL_VEHICULOS.FECHA_SALIDA BETWEEN TO_DATE('$inicio_mes', 'dd/mm/yyyy') AND TO_DATE ('$fin_mes', 'dd/mm/yyyy') AND ADM_HISTORIAL_VEHICULOS.INVENTARIOID = $inventario_id ORDER BY ADM_HISTORIAL_VEHICULOS.FECHA_SALIDA ASC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$movimientos = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

				$movimientos[] = $data;

			}

			return array($movimientos, $mes);
		}

		function reporte_mensual_general_combustible($request){

			/* Usuario */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$nit = $usuario->NIT;

			$inicio_mes = date("d/m/Y", strtotime($request["MES"]));
			$fin_mes = date("t/m/Y", strtotime($request["MES"]));

			setlocale(LC_TIME, 'es_ES');
			$mes = strftime("%B %Y", strtotime($request["MES"]));

			/* Conexion a BD */
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yy'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			/*

				$query = "	SELECT 
							SUM(CUOTA) AS CUOTA, 
							TO_CHAR(FECHA_INICIO, 'dd/mm/yyyy') AS FECHA_INICIO, 
							TO_CHAR(FECHA_FIN, 'dd/mm/yyyy') AS FECHA_FIN, 
							CONCAT(CONCAT(FECHA_INICIO, ' al '), FECHA_FIN) AS SEMANA
						FROM ADM_CUOTAS_COMBUSTIBLE
						WHERE FECHA_INICIO
						BETWEEN TO_DATE('$inicio_mes', 'dd/mm/yyyy') 
						AND TO_DATE('$fin_mes', 'dd/mm/yyyy')
						AND FECHA_FIN
						BETWEEN TO_DATE('$inicio_mes', 'dd/mm/yyyy') 
						AND TO_DATE('$fin_mes', 'dd/mm/yyyy')
						AND INVENTARIOID IN (
							SELECT VEHICULOID 
							FROM ADM_ADMINISTRADOR_VEHICULO WHERE ADMINISTRADOR = '$nit'
						)
						GROUP BY FECHA_INICIO, FECHA_FIN
						ORDER BY TO_DATE(FECHA_FIN) ASC";
			
			*/

			
			$query = "	SELECT 
							SUM(CUOTA) AS CUOTA, 
							TO_CHAR(FECHA_INICIO, 'dd/mm/yyyy') AS FECHA_INICIO, 
							TO_CHAR(FECHA_FIN, 'dd/mm/yyyy') AS FECHA_FIN, 
							CONCAT(CONCAT(FECHA_INICIO, ' al '), FECHA_FIN) AS SEMANA
						FROM ADM_CUOTAS_COMBUSTIBLE
						WHERE FECHA_INICIO
						BETWEEN TO_DATE('$inicio_mes', 'dd/mm/yyyy') 
						AND TO_DATE('$fin_mes', 'dd/mm/yyyy')
						OR FECHA_FIN
						BETWEEN TO_DATE('$inicio_mes', 'dd/mm/yyyy') 
						AND TO_DATE('$fin_mes', 'dd/mm/yyyy')
						AND INVENTARIOID IN (
							SELECT VEHICULOID 
							FROM ADM_ADMINISTRADOR_VEHICULO WHERE ADMINISTRADOR = '$nit'
						)
						GROUP BY FECHA_INICIO, FECHA_FIN
						ORDER BY TO_DATE(FECHA_FIN) ASC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$semanas = array();
			$etiquetas_semanas = array();
			$etiquetas_vehiculos = array();

			$cuotas_grafica = array();
			$consumo_grafica = array();
			$restante_grafica = array();

			$fondo_cuotas = array();
			$borde_cuotas = array();
			$fondo_consumos = array();
			$borde_consumos = array();
			$fondo_restantes = array();
			$borde_restantes = array();

			$total_cuota = 0;
			$total_abastecido = 0;
			$total_sobrante = 0;

			/* Arreglos para grafica Vehiculos */
			$cuotas_grafica_v = array();
			$consumo_grafica_v = array();
			$restante_grafica_v = array();

			$fondo_cuotas_v = array();
			$borde_cuotas_v = array();
			$fondo_consumos_v = array();
			$borde_consumos_v = array();
			$fondo_restantes_v = array();
			$borde_restantes_v = array();

			$total_cuota_v = 0;
			$total_abastecido_v = 0;
			$total_sobrante_v = 0;

			$querys = array();

			$i = 1;
			$ultima_fecha = '';

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

				$etiquetas_semanas [] = $data["SEMANA"];

				$fecha_inicio = $data["FECHA_INICIO"];
				$fecha_fin = $data["FECHA_FIN"];

				$fecha_inicio_format = str_replace('/', '-', $fecha_inicio);
				$fecha_fin_format = str_replace('/', '-', $fecha_fin);
				$inicio_mes_format = str_replace('/', '-', $inicio_mes);
				$fin_mes_format = str_replace('/', '-', $fin_mes);

				/*
					Validar si la fecha de inicio es anterior al mes en curso
				*/
				if(strtotime($fecha_inicio_format) < strtotime($inicio_mes_format)){

					$data["MES_ANTES"] = true;

					$fecha_inicio = $inicio_mes;

				}

				/*
					Validar si la fecha de finalización es superior al mes en curso
				*/
				if(strtotime($fecha_fin_format) > strtotime($fin_mes_format)){

					$data["MES_DESPUES"] = true;

					$fecha_fin = $fin_mes;

				}

				$query_semanas = "	SELECT 
										SUM(CONSUMO) AS TOTAL_CONSUMO 
									FROM ADM_VALES 
									WHERE NVL(FECHA_DESPACHO, FECHA) 
									BETWEEN TO_DATE ('$fecha_inicio', 'dd/mm/yyyy') 
									AND TO_DATE ('$fecha_fin', 'dd/mm/yyyy')
									AND INVENTARIOID IN (
										SELECT 
										VEHICULOID 
										FROM ADM_ADMINISTRADOR_VEHICULO 
										WHERE ADMINISTRADOR = '$nit'
									)";

				$querys [] = $query_semanas;	

				$stid_ = oci_parse($conn, $query_semanas);
				oci_execute($stid_);

				$consumo_ = oci_fetch_array($stid_);

				$data["CONSUMO"] = round($consumo_["TOTAL_CONSUMO"], 2);
				$data["RESTANTE"] = round($data["CUOTA"] - $data["CONSUMO"], 2);

				/* Cuotas de Combustible */
				$cuota = str_replace(',', '.', $data["CUOTA"]);
				$fondo_cuotas [] = "rgba(255, 99, 132, 0.2)";
				$borde_cuotas [] = "rgba(255,99,132,1)";
				$cuotas_grafica [] = $cuota;

				/* Consumo */
				$fondo_consumos [] = "rgba(54, 162, 235, 0.2)";
				$borde_consumos [] = "rgba(54, 162, 235, 1)";
				$consumo_grafica [] = $data["CONSUMO"];

				/* Restante */
				$fondo_restantes [] = "rgba(255, 206, 86, 0.2)";
				$borde_restantes [] = "rgba(255, 206, 86, 1)";
				$restante_grafica [] = $data["CUOTA"] - $data["CONSUMO"];

				/* Totales */
				$total_cuota = round($total_cuota + $cuota, 2);
				$total_abastecido = round($total_abastecido + $data["CONSUMO"], 2);
				$total_sobrante = round($total_sobrante + ($data["CUOTA"] - $data["CONSUMO"]), 2);

				$semanas[] = $data;

				$ultima_fecha = $data["FECHA_FIN"];

				$i++;

			}

			/* Query para generar grafica por vehiculos */
			$query_vehiculos = "	SELECT 
										SUM(ADM_CUOTAS_COMBUSTIBLE.CUOTA) AS CUOTA, 
										ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.INVENTARIOID
									FROM ADM_CUOTAS_COMBUSTIBLE
									INNER JOIN ADM_FICHA_VEHICULOS
									ON ADM_CUOTAS_COMBUSTIBLE.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
									WHERE ADM_CUOTAS_COMBUSTIBLE.FECHA_INICIO
									BETWEEN TO_DATE('$inicio_mes', 'dd/mm/yyyy') 
									AND TO_DATE('$fin_mes', 'dd/mm/yyyy')
									OR ADM_CUOTAS_COMBUSTIBLE.FECHA_FIN
									BETWEEN TO_DATE('$inicio_mes', 'dd/mm/yyyy') 
									AND TO_DATE('$fin_mes', 'dd/mm/yyyy')
									AND ADM_FICHA_VEHICULOS.INVENTARIOID IN (
										SELECT VEHICULOID 
										FROM ADM_ADMINISTRADOR_VEHICULO 
										WHERE ADMINISTRADOR = '$nit'
									)
									GROUP BY ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.INVENTARIOID";

			$stid2 = oci_parse($conn, $query_vehiculos);
			oci_execute($stid2);

			$vehiculos = array();

			while ($data = oci_fetch_array($stid2, OCI_ASSOC)) {

				$etiquetas_vehiculos [] = $data["PLACA"];

				$inventario_id = $data["INVENTARIOID"];

				$query_vehiculo = "	SELECT 
										SUM(CONSUMO) AS TOTAL_CONSUMO 
									FROM ADM_VALES 
									WHERE NVL(FECHA_DESPACHO, FECHA) BETWEEN TO_DATE ('$inicio_mes', 'dd/mm/yy') 
									AND TO_DATE ('$fin_mes', 'dd/mm/yy') 
									AND ADM_VALES.INVENTARIOID = $inventario_id";

				$stid_ = oci_parse($conn, $query_vehiculo);
				oci_execute($stid_);

				$consumo_ = oci_fetch_array($stid_);

				$data["CONSUMO"] = round($consumo_["TOTAL_CONSUMO"], 2);
				$data["RESTANTE"] = round($data["CUOTA"] - $consumo_["TOTAL_CONSUMO"], 2);

				/* Cuotas de Combustible */
				$cuota = str_replace(',', '.', $data["CUOTA"]);
				$fondo_cuotas_v [] = "rgba(255, 99, 132, 0.2)";
				$borde_cuotas_v [] = "rgba(255,99,132,1)";
				$cuotas_grafica_v [] = $cuota;

				/* Consumo */
				$fondo_consumos_v [] = "rgba(54, 162, 235, 0.2)";
				$borde_consumos_v [] = "rgba(54, 162, 235, 1)";
				$consumo_grafica_v [] = $data["CONSUMO"];

				/* Restante */
				$fondo_restantes_v [] = "rgba(255, 206, 86, 0.2)";
				$borde_restantes_v [] = "rgba(255, 206, 86, 1)";
				$restante = round($cuota - $data["CONSUMO"], 2);
				$restante_grafica_v [] = $restante;

				/* Totales */
				$total_cuota_v = round($total_cuota_v + $cuota, 2);
				$total_abastecido_v = round($total_abastecido_v + $consumo_["TOTAL_CONSUMO"], 2);
				$total_sobrante_v = round($total_sobrante_v + ($cuota - $data["CONSUMO"]), 2);

				$vehiculos[] = $data;
			}

			$grafica_semanas = array(
							array(
								"label" => "Cuota",
								"data" => $cuotas_grafica,
								"backgroundColor" => $fondo_cuotas,
								"borderColor" => $borde_cuotas,
								"borderWidth" => 1),
							array(
								"label" => "Consumo",
								"data" => $consumo_grafica,
								"backgroundColor" => $fondo_consumos,
								"borderColor" => $borde_consumos,
								"borderWidth" => 1),
							array(
								"label" => "Restante",
								"data" => $restante_grafica,
								"backgroundColor" => $fondo_restantes,
								"borderColor" => $borde_restantes,
								"borderWidth" => 1));

			$grafica_vehiculos = array(
							array(
								"label" => "Cuota",
								"data" => $cuotas_grafica_v,
								"backgroundColor" => $fondo_cuotas_v,
								"borderColor" => $borde_cuotas_v,
								"borderWidth" => 1),
							array(
								"label" => "Consumo",
								"data" => $consumo_grafica_v,
								"backgroundColor" => $fondo_consumos_v,
								"borderColor" => $borde_consumos_v,
								"borderWidth" => 1),
							array(
								"label" => "Restante",
								"data" => $restante_grafica_v,
								"backgroundColor" => $fondo_restantes_v,
								"borderColor" => $borde_restantes_v,
								"borderWidth" => 1));

			$reporte_generado = 1;

			return array($semanas, $vehiculos, $etiquetas_semanas, $grafica_semanas, $etiquetas_vehiculos, $grafica_vehiculos, $total_cuota_v, $total_cuota, $total_abastecido, $total_sobrante, $total_abastecido_v, $total_sobrante_v, $reporte_generado, $mes, $request, $querys);
		}

		function reporte_mantenimiento($request){

			$fecha_inicio = $request["FECHA_INICIO"];
			$fecha_fin = $request["FECHA_FIN"];

			$query = "SELECT ADM_MANTENIMIENTOS_VEHICULOS.*, ADM_PROVEEDORES.NOMBRE AS NOMBRE_PROVEEDOR
			FROM ADM_MANTENIMIENTOS_VEHICULOS
			INNER JOIN ADM_PROVEEDORES
			ON ADM_MANTENIMIENTOS_VEHICULOS.PROVEEDORID = ADM_PROVEEDORES.PROVEEDORID
			WHERE FECHA BETWEEN TO_DATE('$fecha_inicio', 'dd/mm/yyyy') AND TO_DATE('$fecha_fin', 'dd/mm/yyyy') ORDER BY FECHA ASC";

			/* Conexion a BD */
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$reporte = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$mantenimiento_id = $data["MANTENIMIENTOID"];

				$query = "SELECT ADM_REVISIONES_MANTENIMIENTO.NOMBRE
				FROM ADM_DETALLES_MANTENIMIENTO
				INNER JOIN ADM_REVISIONES_MANTENIMIENTO
				ON ADM_DETALLES_MANTENIMIENTO.REVISIONID = ADM_REVISIONES_MANTENIMIENTO.ID
				WHERE MANTENIMIENTOID = $mantenimiento_id AND ADM_DETALLES_MANTENIMIENTO.REALIZADO = 1";

				$stid_ = oci_parse($conn, $query);
				oci_execute($stid_);

				$revisiones = array();

				while ($data_ = oci_fetch_array($stid_,OCI_ASSOC)) {

					$revisiones [] = $data_["NOMBRE"];

				}

				$data["TRABAJO_REALIZADO"] = $revisiones;

				$query = "SELECT NOMBRE
				FROM ADM_DETALLES_MANTENIMIENTO
				WHERE MANTENIMIENTOID = $mantenimiento_id AND ADM_DETALLES_MANTENIMIENTO.REALIZADO = 1";

				$stid_ = oci_parse($conn, $query);
				oci_execute($stid_);

				$revisiones = array();

				while ($data_ = oci_fetch_array($stid_,OCI_ASSOC)) {

					$revisiones [] = $data_["NOMBRE"];

				}

				$data["TRABAJO_EXTRA"] = $revisiones;

				$reporte[] = $data;

			}

			return array($reporte, $fecha_inicio, $fecha_fin);
		}

		function reporte_anual_combustible($request){

			$year = $request["YEAR"];
			$inventario_id = $request["INVENTARIOID"];

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yyyy'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			setlocale(LC_TIME, 'es_ES');

			$galones_total = array();
			$galones_total2 = array();

			$galones_autorizados = array();
			$galones_autorizados2 = array();

			$diferencia = array();
			$galones_pendientes = array();

			for ($i=1; $i <= 12; $i++) {

				$mes = $year . '-' . $i;

				$inicio_mes = date("d/m/Y", strtotime($mes));
				$fin_mes = date("t/m/Y", strtotime($mes));

				/* Galones consumidos */
				$query = "SELECT SUM(CONSUMO) AS TOTAL_CONSUMO FROM ADM_VALES
				WHERE FECHA  BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY')
				AND INVENTARIOID = $inventario_id";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);

				$total_consumido = oci_fetch_array($stid);

				if ($total_consumido["TOTAL_CONSUMO"] != NULL) {

					$galones_total [] = $total_consumido["TOTAL_CONSUMO"];

				}else{

					$galones_total [] = 0;
					$total_consumido["TOTAL_CONSUMO"] = 0;

				}

				$galones_total2 [] = $total_consumido;

				/* Galones Autorizados */
				$query = "SELECT SUM(CUOTA) AS TOTAL FROM ADM_CUOTAS_COMBUSTIBLE
				WHERE FECHA_INICIO BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY') AND
				FECHA_FIN BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY') AND
				INVENTARIOID = $inventario_id";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);

				$total = oci_fetch_array($stid);

				if ($total["TOTAL"] != NULL) {

					$galones_autorizados [] = $total["TOTAL"];
					$total_c = $total_consumido["TOTAL_CONSUMO"];

					$diferencia [] = round(( $total_consumido["TOTAL_CONSUMO"] * 100) / $total["TOTAL"], 2);


				}else{

					$galones_autorizados [] = 0;
					$diferencia [] = 0;

				}

				$galones_pendientes [] = round($total["TOTAL"] - $total_consumido["TOTAL_CONSUMO"], 2);

			}

			return array($year, $galones_total, $galones_autorizados, $diferencia, $galones_pendientes);
		}

		function reporte_individual_rendimiento($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$mes_inicio = strtotime($request["FECHA_INICIO"]);
			$mes_fin = strtotime($request["FECHA_FIN"]);

			setlocale(LC_TIME, 'es_ES');
			$txt_mes_inicio = strtoupper(strftime("%B %Y", strtotime($request["FECHA_INICIO"])));
			$txt_mes_fin = strtoupper(strftime("%B %Y", strtotime($request["FECHA_FIN"])));

			$inventario_id = $request["INVENTARIOID"];

			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yy'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$i = 0;

			$meses = array();
			$etiquetas_meses = array();
			$valores_grafica = array();

			while ($mes_inicio <= $mes_fin) {

				$inicio_mes = date("d/m/Y", $mes_inicio);
				$fin_mes = date("t/m/Y", $mes_inicio);

				setlocale(LC_TIME, 'es_ES');
				$mes = strftime("%B", $mes_inicio);

				$etiquetas_meses [] = $mes;

				$query = "SELECT MIN(TO_NUMBER(KM_SALIDA)) AS KM_SALIDA, MAX(TO_NUMBER(KM_ENTRADA)) AS KM_ENTRADA FROM ADM_HISTORIAL_VEHICULOS WHERE FECHA_SALIDA BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY') AND FECHA_ENTRADA BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY') AND INVENTARIOID = $inventario_id ORDER BY FECHA_SALIDA ASC";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);

				$resultado = oci_fetch_array($stid);

				$resultado["KM_RECORRIDOS"] = number_format($resultado["KM_ENTRADA"] - $resultado["KM_SALIDA"]);

				$query = "SELECT SUM(CONSUMO) AS CONSUMO FROM ADM_VALES WHERE FECHA BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY') AND INVENTARIOID = $inventario_id";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);

				$consumo = oci_fetch_array($stid);

				$resultado["CONSUMO"] = $consumo["CONSUMO"];

				if ($resultado["CONSUMO"] != NULL) {

					$resultado["KM_GALON"] = round(($resultado["KM_ENTRADA"] - $resultado["KM_SALIDA"]) / $resultado["CONSUMO"], 1);

				}else{

					$resultado["KM_GALON"] = 0;

				}


				$valores_grafica [] = $resultado["KM_GALON"];

				$resultado["KM_SALIDA"] = number_format($resultado["KM_SALIDA"]);

				$resultado["KM_ENTRADA"] = number_format($resultado["KM_ENTRADA"]);

				$fecha_letras = date("Y-m", $mes_inicio);

				$resultado["MES"] = strtoupper($mes);

				$mes_inicio = strtotime($fecha_letras . " +1 Month ");

				$meses[] = $resultado;

			}

			return array($meses, $etiquetas_meses, $valores_grafica, $txt_mes_inicio, $txt_mes_fin);
		}

		function reporte_general_rendimiento($request){

			/* Usuario */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$nit = $usuario->NIT;

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			setlocale(LC_TIME, 'es_ES');
			$mes = strftime("%B %Y", strtotime($request["MES"]));

			$inicio_mes = date("d/m/Y", strtotime($request["MES"]));
			$fin_mes = date("t/m/Y", strtotime($request["MES"]));

			/* Mes en el que se esta generando el reporte */ 
			$mes_ =  date("m/Y", strtotime($request["MES"]));	

			$fuente = $request["FUENTE"];

			$inicio_mes_anterior = date("d/m/Y", strtotime($request["MES"] . ' - 1 month '));
			$fin_mes_anterior = date("t/m/Y", strtotime($request["MES"] . ' - 1 month '));

			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yy'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query = "SELECT PLACA, INVENTARIOID FROM ADM_FICHA_VEHICULOS WHERE INVENTARIOID IN (SELECT VEHICULOID FROM ADM_ADMINISTRADOR_VEHICULO WHERE ADMINISTRADOR = '$nit')";
			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$vehiculos = array();
			$etiquetas_vehiculos = array();
			$valores_vehiculos = array();
			$consumo_array = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$inventario_id = $data["INVENTARIOID"];
				$placa = $data["PLACA"];

				/* Verificar si le fuente es de Historial de Entradas y Salidos o Vales */

				if ($fuente == 1) {

					$query = "SELECT MIN(TO_NUMBER(KM_SALIDA)) AS KM_SALIDA, MAX(TO_NUMBER(KM_ENTRADA)) AS KM_ENTRADA FROM ADM_HISTORIAL_VEHICULOS WHERE FECHA_SALIDA BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY') AND FECHA_ENTRADA BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY') AND INVENTARIOID = $inventario_id ORDER BY FECHA_SALIDA ASC";

					$stid_ = oci_parse($conn, $query);
					oci_execute($stid_);

					$resultado = oci_fetch_array($stid_);

				}else{

					$query = "	SELECT MAX(TO_NUMBER(KILOMETRAJE)) AS KM_ENTRADA
								FROM ADM_VALES
								WHERE TO_CHAR(NVL(FECHA_DESPACHO, FECHA), 'MM/YYYY') = '$mes_'
								AND KILOMETRAJE != 0 AND KILOMETRAJE IS NOT NULL
								AND INVENTARIOID = $inventario_id";

					// $query = "SELECT MAX(TO_NUMBER(KILOMETRAJE)) AS KM_ENTRADA
					// FROM ADM_VALES
					// WHERE NVL(FECHA_DESPACHO, FECHA) BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY')
					// AND KILOMETRAJE != 0 AND KILOMETRAJE IS NOT NULL
					// AND INVENTARIOID = $inventario_id";

					$stid_ = oci_parse($conn, $query);
					oci_execute($stid_);

					$resultado = oci_fetch_array($stid_);

					$query = "	SELECT KILOMETRAJE AS KM_SALIDA
								FROM ADM_VALES
								WHERE NVL(FECHA_DESPACHO, FECHA) < TO_DATE('$mes_', 'MM/YYYY')
								AND KILOMETRAJE != 0 AND KILOMETRAJE IS NOT NULL
								AND INVENTARIOID = $inventario_id  ORDER BY VALEID DESC";

					// $query = "SELECT KILOMETRAJE AS KM_SALIDA
					// FROM ADM_VALES
					// WHERE NVL(FECHA_DESPACHO, FECHA) BETWEEN TO_DATE('$inicio_mes_anterior', 'DD/MM/YYYY') AND TO_DATE('$fin_mes_anterior', 'DD/MM/YYYY')
					// AND KILOMETRAJE != 0 AND KILOMETRAJE IS NOT NULL
					// AND INVENTARIOID = $inventario_id  ORDER BY FECHA DESC";

					$stid_ = oci_parse($conn, $query);
					oci_execute($stid_);

					$resultado_mes_anterior = oci_fetch_array($stid_);

					// $conteo_registros = count($resultado_mes_anterior);

					if ($placa == "P-203DGB") {
						# code...

						if ($resultado_mes_anterior["KM_SALIDA"] == 0) {
						
							$resultado["KM_SALIDA"] = 245789;

						}else{

							$resultado["KM_SALIDA"] = $resultado_mes_anterior["KM_SALIDA"];

						}
						
					}else{

						$resultado["KM_SALIDA"] = $resultado_mes_anterior["KM_SALIDA"];

					}

				}


				// $stid_ = oci_parse($conn, $query);
				// oci_execute($stid_);
				//
				// $resultado = oci_fetch_array($stid_);

				$query = "SELECT SUM(CONSUMO) AS CONSUMO FROM ADM_VALES WHERE NVL(FECHA_DESPACHO, FECHA) BETWEEN TO_DATE('$inicio_mes', 'DD/MM/YYYY') AND TO_DATE('$fin_mes', 'DD/MM/YYYY') AND INVENTARIOID = $inventario_id";

				$stid_ = oci_parse($conn, $query);
				oci_execute($stid_);

				$consumo = oci_fetch_array($stid_);

				// if ($fuente == 1) {
				//
				//
				//
				// }else{
				//
				// 	$data["KM_INICIAL"] = number_format($resultado["KM_SALIDA"]);
				//
				//
				// }

				$data["KM_INICIAL"] = number_format($resultado["KM_SALIDA"]);
				$data["KM_FINAL"] = number_format($resultado["KM_ENTRADA"]);
				$data["KM_RECORRIDOS"] = number_format($resultado["KM_ENTRADA"] - $resultado["KM_SALIDA"]);

				$data["TOTAL_GALONES"] = $consumo["CONSUMO"];

				if ($data["TOTAL_GALONES"] != NULL) {

					$data["KM_GALON"] = round(($resultado["KM_ENTRADA"] - $resultado["KM_SALIDA"]) / $consumo["CONSUMO"], 1);

				}else{

					$data["KM_GALON"] = 0;

				}

				$consumo_array [] = $consumo["CONSUMO"];
				$vehiculos [] = $data;
				$etiquetas_vehiculos [] = $data["PLACA"];
				$valores_vehiculos [] = $data["KM_GALON"];

			}

			return array($vehiculos, $mes, $etiquetas_vehiculos, $valores_vehiculos, $inicio_mes, $fin_mes, $query, $consumo_array, $inicio_mes_anterior, $fin_mes_anterior, $mes_);
		}

		function reporte_general_kilometraje(){

			/* Usuario */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$nit = $usuario->NIT;

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT PLACA, INVENTARIOID, KM_ACTUAL, KM_SERVICIO FROM ADM_FICHA_VEHICULOS WHERE INVENTARIOID IN (SELECT VEHICULOID FROM ADM_ADMINISTRADOR_VEHICULO WHERE ADMINISTRADOR = '$nit')";
			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$vehiculos = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$inventario_id = $data["INVENTARIOID"];

				$query = "SELECT TO_CHAR(FECHA, 'DD/MM/YYYY') AS FECHA, KILOMETRAJE_ACTUAL FROM ADM_MANTENIMIENTOS_VEHICULOS WHERE INVENTARIOID = $inventario_id AND ROWNUM = 1 AND ESTADO >= 2 ORDER BY MANTENIMIENTOID DESC";

				$stid_ = oci_parse($conn, $query);
				oci_execute($stid_);

				$mantenimiento = oci_fetch_array($stid_);

				$data["KILOMETRAJE_ACTUAL"] = $mantenimiento["KILOMETRAJE_ACTUAL"];
				$data["FECHA"] = $mantenimiento["FECHA"];

				$vehiculos [] = $data;

			}

			return array($vehiculos);
		}

		function reporte_individual_vales($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$inventario_id = $request["INVENTARIOID"];
			$fecha_inicio = $request["FECHA_INICIO"];
			$fecha_fin = $request["FECHA_FIN"];

			$query = "SELECT T1.NO_VALE, T1.NO_GESTION, T1.FECHA, T1.HORA, T1.CONSUMO, T2.PLACA, CONCAT(CONCAT(T3.NOMBRE, ' '), T3.APELLIDO) AS PILOTO,
			TO_CHAR(T1.FECHA_ENTREGA, 'DD/MM/YYYY') AS FECHA_ENTREGA, TO_CHAR(T1.FECHA_ENTREGA, 'HH:MI AM') AS HORA_ENTREGA, T1.PERSONA_ENTREGA
			FROM ADM_VALES T1
			INNER JOIN ADM_FICHA_VEHICULOS T2
			ON T1.INVENTARIOID = T2.INVENTARIOID
			INNER JOIN RH_EMPLEADOS T3
			ON T1.RESPONSABLE = T3.NIT
			WHERE TO_DATE(FECHA, 'DD/MM/YY') BETWEEN TO_DATE('$fecha_inicio', 'DD/MM/YY') AND TO_DATE('$fecha_fin', 'DD/MM/YY')
			AND T1.ESTADO = 6 AND T1.INVENTARIOID = $inventario_id
			ORDER BY T1.NO_VALE ASC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$vales = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$vales [] = $data;

			}

			return array($vales, $fecha_inicio, $fecha_fin);

		}

		function reporte_general_vales($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$fecha_inicio = $request["FECHA_INICIO"];
			$fecha_fin = $request["FECHA_FIN"];
			$tipo_reporte = $request["TIPO_REPORTE"];
			$vehiculos = $request["VEHICULOS"];
			$vales_anulados = $request["ANULADOS"];

			if ($vales_anulados == 1) {

				$vales_estados = array(5,6,7,9);

			}else if($vales_anulados == 2){

				$vales_estados = array(5,6);

			}

			$estados_separados = implode(",", $vales_estados);

			if ($tipo_reporte == 1) {

				/* Obtener el máximo y mínimo */
				$query = "	SELECT MAX(NO_VALE) AS MAX , MIN(NO_VALE) AS MIN
							FROM ADM_VALES
							WHERE TO_DATE(FECHA, 'DD/MM/YY') BETWEEN TO_DATE('$fecha_inicio', 'DD/MM/YY') AND TO_DATE('$fecha_fin', 'DD/MM/YY')";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);

				$result = oci_fetch_array($stid, OCI_ASSOC);
				$min = $result["MIN"];
				$max = $result["MAX"];

				$query = "SELECT T1.NO_VALE, T1.NO_GESTION, T1.FECHA, T1.HORA, T1.CONSUMO, T1.ESTADO, TO_CHAR(T1.FECHA_DESPACHO, 'DD/MM/YYYY') AS FECHA_DESPACHO, T2.PLACA, CONCAT(CONCAT(T3.NOMBRE, ' '), T3.APELLIDO) AS PILOTO,
				TO_CHAR(T1.FECHA_ENTREGA, 'DD/MM/YYYY') AS FECHA_ENTREGA, TO_CHAR(T1.FECHA_ENTREGA, 'HH:MI AM') AS HORA_ENTREGA, T1.PERSONA_ENTREGA
				FROM ADM_VALES T1
				LEFT JOIN ADM_FICHA_VEHICULOS T2
				ON T1.INVENTARIOID = T2.INVENTARIOID
				LEFT JOIN RH_EMPLEADOS T3
				ON T1.RESPONSABLE = T3.NIT
				WHERE TO_DATE(FECHA, 'DD/MM/YY') BETWEEN TO_DATE('$fecha_inicio', 'DD/MM/YY') AND TO_DATE('$fecha_fin', 'DD/MM/YY')
				AND T1.ESTADO IN ($estados_separados)
				OR T1.NO_VALE BETWEEN $min AND $max
				AND T1.ESTADO IN ($estados_separados)
				ORDER BY T1.NO_VALE ASC";

				$vehiculos_reporte = "Todos los vehículos";

			}else if($tipo_reporte == 2){

				$vehiculos_separados = implode(",", $vehiculos);

				$query = "SELECT T1.NO_VALE, T1.NO_GESTION, T1.FECHA, T1.HORA, T1.CONSUMO, T1.ESTADO, TO_CHAR(T1.FECHA_DESPACHO, 'DD/MM/YYYY') AS FECHA_DESPACHO, T2.PLACA, CONCAT(CONCAT(T3.NOMBRE, ' '), T3.APELLIDO) AS PILOTO,
				TO_CHAR(T1.FECHA_ENTREGA, 'DD/MM/YYYY') AS FECHA_ENTREGA, TO_CHAR(T1.FECHA_ENTREGA, 'HH:MI AM') AS HORA_ENTREGA, T1.PERSONA_ENTREGA
				FROM ADM_VALES T1
				INNER JOIN ADM_FICHA_VEHICULOS T2
				ON T1.INVENTARIOID = T2.INVENTARIOID
				INNER JOIN RH_EMPLEADOS T3
				ON T1.RESPONSABLE = T3.NIT
				WHERE TO_DATE(FECHA, 'DD/MM/YY') BETWEEN TO_DATE('$fecha_inicio', 'DD/MM/YY') AND TO_DATE('$fecha_fin', 'DD/MM/YY')
				AND T1.ESTADO IN ($estados_separados) AND T1.INVENTARIOID IN ($vehiculos_separados)
				ORDER BY T1.NO_VALE ASC";

				$query_ = "	SELECT PLACA
							FROM ADM_FICHA_VEHICULOS
							WHERE INVENTARIOID IN ($vehiculos_separados)";

				$stid_ = oci_parse($conn, $query_);
				oci_execute($stid_);

				$placas = array();

				while ($data = oci_fetch_array($stid_,OCI_ASSOC)) {

					$placas [] = $data["PLACA"];

				}

				$placas_separadas = implode(", ", $placas);

				$vehiculos_reporte = $placas_separadas;

			}

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$vales = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$vales [] = $data;

			}

			return array($vales, $fecha_inicio, $fecha_fin, $vehiculos_reporte);

		}

	}

?>

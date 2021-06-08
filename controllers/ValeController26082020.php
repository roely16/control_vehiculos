<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Bitacora_EventosController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/CuotaController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/ValeController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/SolicitudesValesController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/DocumentosController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/mail/mail.php';

	class ValeController{

		//Listar Vales
		function listar_vales(){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "	SELECT ADM_VALES.*, RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, ADM_FICHA_VEHICULOS.PLACA
			FROM ADM_VALES
			INNER JOIN RH_EMPLEADOS
			ON ADM_VALES.RESPONSABLE = RH_EMPLEADOS.NIT
			INNER JOIN ADM_FICHA_VEHICULOS
			ON ADM_VALES.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
			ORDER BY ADM_VALES.NO_VALE DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$vales = array();
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$vales[] = $data;
			}

			$vales_ctrl = new ValeController();
			$vales_restantes = $vales_ctrl->vales_restantes();

			return array($vales, $vales_restantes);
		}

		//Registrar nuevo talonario
		function registrar_talonario($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();
			$inicio = $request["inicio"];
			$fin = $request["fin"];
			$inventarioid = $request["INVENTARIOID"];

			if ($inventarioid != 0) {

				if ($inicio < $fin) {

				$talonario = $request["no"];

				for ($i = $inicio; $i <= $fin  ; $i++) {

					$stid = oci_parse($conn, "INSERT INTO ADM_VALES(TALONARIO, NO_VALE, ESTADO) VALUES ($talonario, $i, 4)");

					oci_execute($stid);
				}

				//Retornar cantidad de vales restantes
				$vales_restantes = $this->vales_restantes();

				//Registrar en la bitacora
				$bitacora_ctrl = new Bitacora_EventosController();
				$usuario = $bitacora_ctrl->obtener_usuario();
				$resultado = $bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha registrado el talonario No. $talonario con vales del $inicio al $fin", $inventarioid);

				//Retornar bitacora para actualizar la tabla
				$bitacora = $bitacora_ctrl->obtener_eventos($inventarioid);

				return array(1, $vales_restantes, $bitacora);

				}else{

					return 0;
				}

			}else{

				if ($inicio < $fin) {

					$talonario = $request["no"];

					for ($i = $inicio; $i <= $fin  ; $i++) {

						$stid = oci_parse($conn, "INSERT INTO ADM_VALES(TALONARIO, NO_VALE, ESTADO) VALUES ($talonario, $i, 4)");

						oci_execute($stid);
					}

					//Retornar cantidad de vales restantes
					$vales_restantes = $this->vales_restantes();

					return array(1, $vales_restantes);

				}else{

					return 0;
				}

			}
		}

		//Validar existencia de vale
		function validar_existencia_vale($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			/* Validar que no existan vales pendientes de entrega */

			$pendientes = $this->vales_pendientes_entrega($id);

			/*Obtener la cuota de combustible*/
			$cuota_ctrl = new CuotaController();
			$cuota = $cuota_ctrl->obtener_cuota_activa($id);

			if (!$cuota) {

				/* No existe una cuota de combustible */

				return array(0);

			}else{

				if ($pendientes != false) {

					$pendientes = 1;

				}else{

					$pendientes = 0;

				}

				$query = "SELECT * FROM ADM_VALES WHERE (ESTADO = 4) ORDER BY NO_VALE ASC";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);

				$data = oci_fetch_object($stid);

				$query = "SELECT * FROM RH_AREAS WHERE APLICA_VALE = 'S'";
				$stid = oci_parse($conn, $query);
				oci_execute($stid);

				$areas = array();

				while($data_ = oci_fetch_array($stid,OCI_ASSOC))
				{
					$areas[] = $data_;
				}

				return array(1, $data, $pendientes, $areas);

			}
		}

		//Se registra un vale
		function registrar_vale($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			/*Datos del Vale*/
			date_default_timezone_set('America/Guatemala');
			$hora = date('h:i:s A');
			$valeid = $request["VALEID"];
			$inventarioid = $request["INVENTARIOID"];

			$fecha = $request["FECHA"];

			$no_vale = $request["NO_VALE"];
			$responsable = $request["RESPONSABLE"];
			$departamento = $request["DEPARTAMENTO"];
			$direccion = $request["DIRECCION"];
			$gasolinera = $request["GASOLINERA"];
			$comision = $request["COMISION"];
			$gestion = $request["GESTION"];

			/*Obtener la cuota de combustible*/
			$cuota_ctrl = new CuotaController();
			$cuota = $cuota_ctrl->obtener_ultima_cuota($inventarioid);

			$fecha_inicio = strtotime(str_replace('/', '-', $cuota->FECHA_INICIO));
			$fecha_fin = strtotime(str_replace('/', '-', $cuota->FECHA_FIN));
			$fecha_vale = strtotime(str_replace('/', '-', $fecha));

			/* Validar que la fecha del vale este entre el rango de fechas de la cuota activa */

			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();

				if ($gestion != 0) {

					date_default_timezone_set('America/Guatemala');
					$fecha_fin = date('d/m/Y H:i:s');

					$query = "UPDATE ADM_GESTIONES SET STATUS = 5, FECHAFINALIZACION = TO_DATE('$fecha_fin', 'DD/MM/YYYY HH24:MI:SS'), FINALIZADAPOR = 'freal' WHERE GESTIONID = $gestion";

					$stid = oci_parse($conn, $query);
					oci_execute($stid);

					/* Cambiar estado en Workflow */
					$query = "UPDATE ADM_WORKFLOW SET FECHAFINAL = TO_DATE('$fecha_fin', 'DD/MM/YYYY HH24:MI:SS'), ESTADO = 'FINALIZADA' WHERE GESTIONID = $gestion";

					$stid = oci_parse($conn, $query);
					oci_execute($stid);

					$solicitudes_ctrl = new SolicitudesValesController();
					$usuario = $solicitudes_ctrl->detalles_solicitud($gestion);

					$text = "La gestión No. ".$gestion." se encuentra FINALIZADA<br>
		            Para ver detalles por favor ingrese al portal de recursos humanos <br>
			    	http://172.23.25.31/GestionServicios/ con su usuario y clave, luego siga los siguientes pasos:<br>
				    <ul>
				    <li>Seleccionar modulo de Gestiones</li>
				    <li>Click en Consulta de Gestiones</li>
				    <li>Filtrar por status FINALIZADO</li>
				    </ul><br>";


					$mail = new Mail();

					$mail->send_mail($usuario->EMAILMUNI, 'Finalización de gestión', $text);

				}

				/*Query para actualizar el vale*/
				$query = "UPDATE ADM_VALES SET ESTADO = 5, INVENTARIOID = $inventarioid, GASOLINERA = '$gasolinera', COMISION = '$comision', FECHA = '$fecha', HORA = '$hora', RESPONSABLE = '$responsable', DEPARTAMENTO = '$departamento', DIRECCION = '$direccion', NO_GESTION = $gestion WHERE VALEID = $valeid";

				/*Ejecucion de Query*/
				$stid = oci_parse($conn, $query);
				oci_execute($stid);
                
				//Regitrar en la bitacora
				$resultado = $bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha emitido el vale No. $no_vale", $inventarioid);

				//Retornas los vales para actualizar la tabla
				$vales = $this->obtener_vales_vehiculo($inventarioid);

				//Cantidad de vales restantes
				$vales_restantes = $this->vales_restantes();

				//Bitacora
				$bitacora = $bitacora_ctrl->obtener_eventos($inventarioid);


				/* Funcion para enviar una encuesta por correo electrónico gmartinez 27.08.2018 */
				// 08/10/2018 11:56:10 AM
				$num_mes = date('m');
				$num_anio = date('Y');
				$idmedicion = 7;

				$query = "SELECT  COUNT(*) AS vales
                        FROM  adm_vales
                       WHERE  to_char(to_date(fecha,'DD/MM/YYYY'),'MMYYYY') = '".$num_mes.$num_anio."'";
				$stid = oci_parse($conn, $query);
				oci_execute($stid, OCI_DEFAULT);
				$row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS);

				$total_vales = $row['VALES'];

				$porcentaje_medicion = round( ( ($total_vales) * (3.8416) * (90) * (10) ) / ( (100) * ($total_vales - 1) + (3.8416) * (90) * (10) ) );

				$query = "SELECT  COUNT(*) AS medicion
                        FROM  msa_medicion_encabezado
                       WHERE  id_medicion = ".$idmedicion."
                              and TO_CHAR(fecha_carga,'YYYYMM') = '".$num_anio.$num_mes."'";
				$stid = oci_parse($conn, $query);
				oci_execute($stid, OCI_DEFAULT);
				$row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS);

				$medicion = $row['MEDICION'];

				if ($medicion < $porcentaje_medicion){

				    //include 'email.php';

				    $query = "SELECT  SEQ_MEDICION.NEXTVAL AS correl
                            FROM  DUAL";
				    $stid = oci_parse($conn, $query);
				    $validar = oci_execute($stid);
				    $row = oci_fetch_array($stid,OCI_ASSOC+OCI_RETURN_NULLS);

				    $correl = $row['CORREL'];

				    $fecha_inicio = '1-'.$num_mes.'-'.$num_anio;
				    $fecha_fin = date("t-m-Y",strtotime($fecha_inicio));
				    $fecha_inicio = str_replace('-','/',$fecha_inicio);
				    $fecha_fin = str_replace('-','/',$fecha_fin);

				    $query = "SELECT  a.fecha,
                                  b.usuarioid,
                                  b.quien,
                                  a.comision,
                                  c.emailmuni
                            FROM  adm_vales a,
                                  adm_workflow b,
                                  rh_empleados c
                           WHERE  a.no_gestion = b.gestionid
                                  AND b.quien = c.usuario
                                  and no_vale = '$no_vale'";

				    $stid = oci_parse($conn, $query);
				    oci_execute($stid);
				    $row = oci_fetch_array($stid,OCI_ASSOC+OCI_RETURN_NULLS);

				    $fecha_servicio = $row['FECHA'];
				    $usr_atendio = $row['USUARIOID'];
				    $solicitante = $row['QUIEN'];
				    $tema = $row['COMISION'];
				    $mail = $row['EMAILMUNI'];

					if ($solicitante != 'JOPEDROZA'){

						if ($validar){

							$query = "INSERT INTO msa_medicion_encabezado (id_medicion,
																	correlativo,
																	fecha_servicio,
																	fecha_carga,
																	colaborador,
																	cliente,
																	periodo_del,
																	periodo_al,
																	comentario_referencia,
																	doc_referencia,
																	para_medir,
																	contacto,
																	fecha_envio)
															VALUES (".$idmedicion.",
																	".$correl.",
																	TO_DATE('".$fecha_servicio."','DD/MM/YYYY'),
																	SYSDATE,
																	UPPER('".$usr_atendio."'),
																	UPPER('".$solicitante."'),
																	TO_DATE('".$fecha_inicio."','DD/MM/YYYY'),
																	TO_DATE('".$fecha_fin."','DD/MM/YYYY'),
																	'".$tema."',
																	'".$no_vale."',
																	'X',
																	'".$mail."',
																	SYSDATE)";

							$stid = oci_parse($conn, $query);
							oci_execute($stid, OCI_DEFAULT);
							oci_commit($conn);

						}
					
						$name   = '';
						$attach = '';
						$titulo = 'Encuesta para el vale No.'.$no_vale;

						$texto = '';
						$texto.= '<html>';
						$texto.= '    <body>';
						$texto.= '      Se ha generado una encuesta hacia su persona para calificar el servicio de vales, favor responderla en el siguiente enlace<br><br>';
						$texto.= '      http://172.23.25.31/GestionServicios/satisfaccion_ci/encuesta_vales.php?id='.$no_vale.'&medicion=7&correo=S';
						$texto.= '    </body>';
						$texto.= '</html>';

						$message_email = new Mail();

						$message_email->send_mail($mail, $titulo, $texto);
					
					}
				}
				/* Fin envio de encuesta por correo electronico gmartinez 27.08.2018*/


				return array(1, $vales, $vales_restantes, $bitacora, $query);
		}

		//Se obtienen todos los vales emitidos
		function obtener_vales(){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM ADM_VALES WHERE ESTADO = 1 ORDER BY NO_VALE DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$json = array();
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$json[] = $data;
			}

			return $json;
		}

		//Se obtienen los detalles del vale
		function detalles_vale($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query = "SELECT ADM_VALES.VALEID, ADM_VALES.NO_GESTION, ADM_VALES.NO_VALE, ADM_VALES.FECHA, ADM_VALES.HORA, ADM_VALES.GASOLINERA, ADM_VALES.ESTADO, ADM_VALES.INVENTARIOID, ADM_VALES.CONSUMO, ADM_VALES.DEPARTAMENTO, ADM_VALES.DIRECCION, ADM_VALES.CUOTAID, ADM_VALES.KILOMETRAJE, ADM_VALES.COMISION, TO_CHAR(ADM_VALES.FECHA_ENTREGA, 'DD/MM/YYYY HH24:MI') AS FECHA_ENTREGA, ADM_VALES.PERSONA_ENTREGA, TO_CHAR(ADM_VALES.FECHA_DESPACHO, 'DD/MM/YYYY') AS FECHA_DESPACHO,
					ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.COLOR, ADM_FICHA_VEHICULOS.TIPO, ADM_FICHA_VEHICULOS.MARCA,
					ADM_FICHA_VEHICULOS.TIPO_COMBUSTIBLE, ADM_FICHA_VEHICULOS.MODELO, ADM_FICHA_VEHICULOS.LINEA, RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, RH_EMPLEADOS.NIT, CONCAT(CONCAT(RH_EMPLEADOS.NOMBRE , ' '), RH_EMPLEADOS.APELLIDO) AS RESPONSABLE
					FROM ADM_VALES
					INNER JOIN ADM_FICHA_VEHICULOS
					ON ADM_VALES.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
					INNER JOIN RH_EMPLEADOS
					ON ADM_VALES.RESPONSABLE = RH_EMPLEADOS.NIT
					WHERE ADM_VALES.VALEID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$data = oci_fetch_object($stid);

			return $data;
		}

		//Obtener vales de un vehiculo en particular
		function obtener_vales_vehiculo($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query = "	SELECT ADM_VALES.*, RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, RH_EMPLEADOS.NIT FROM ADM_VALES INNER JOIN RH_EMPLEADOS ON ADM_VALES.RESPONSABLE = RH_EMPLEADOS.NIT WHERE ADM_VALES.INVENTARIOID = $id ORDER BY VALEID DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$json = array();
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$json[] = $data;
			}

			return $json;
		}

		//Editar vale a finalizado o anulado
		function editar_vale($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$consumo = $request["CONSUMO"];
			$estado = $request["ESTADO"];
			$inventarioid = $request["INVENTARIOID"];
			$no_vale = $request["NO_VALE"];
			$kilometraje = $request["KILOMETRAJE"];
			$cuota_id = $request["CUOTAID"];
			

			if ($estado == 6) {
				
				$fecha_despacho = $request["FECHA_DESPACHO"];

				$query_sysdate = "ALTER SESSION SET NLS_DATE_FORMAT = 'DD/MM/YYYY'";
				$stid = oci_parse($conn, $query_sysdate);
				oci_execute($stid);

				//Actualizacion de el kilometraje del vehiculo asociado al vale Johans Paz
				$sql = "SELECT INVENTARIOID FROM ADM_VALES WHERE NO_VALE = ".$no_vale;
				$stid = oci_parse($conn, $sql);
				oci_execute($stid);
				$row = oci_fetch_array($stid, OCI_NUM);
				$inventarioid = $row[0];
				
			    $sql = "UPDATE ADM_FICHA_VEHICULOS SET KM_ACTUAL = ".$kilometraje." WHERE INVENTARIOID = ".$inventarioid;
				$stid = oci_parse($conn, $sql);
				oci_execute($stid);
				//Fin Actualizacion de el kilometraje del vehiculo asociado al vale
				
				//Verificacion si esta por llegar a su proximo servicio para alertar y crear gestion
				$alertar = false;
				$sql = "SELECT KM_SERVICIO FROM ADM_FICHA_VEHICULOS WHERE INVENTARIOID = ".$inventarioid;
				$stid = oci_parse($conn, $sql);
				oci_execute($stid);
				$row = oci_fetch_array($stid, OCI_NUM);
				$km_servicio = $row[0];
				$restante = $kilometraje - $km_servicio;
				if($restante < 1000){
					$alertar = true;
				}
				
				//Verificacion si esta por llegar a su proximo servicio para alertar y crear gestion
				$query = "UPDATE ADM_VALES SET CONSUMO = $consumo, ESTADO = $estado, KILOMETRAJE = $kilometraje, FECHA_DESPACHO = '$fecha_despacho'  WHERE NO_VALE = $no_vale";

			}else{

				$query = "UPDATE ADM_VALES SET CONSUMO = $consumo, ESTADO = $estado, KILOMETRAJE = $kilometraje  WHERE NO_VALE = $no_vale";

			}

			
			$stid = oci_parse($conn, $query);

			oci_execute($stid);

			/*
			$cuota_ctrl = new CuotaController();
			$cuota = $cuota_ctrl->obtener_cuota($cuota_id);

			if ($cuota->RESTANTE == '') {

				$restante = $cuota->CUOTA - $consumo;

			}else{

				$restante = $cuota->RESTANTE - $consumo;

			}

			$query = "UPDATE ADM_CUOTAS_COMBUSTIBLE SET RESTANTE = $restante WHERE CUOTAID = $cuota_id";
			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$cuotas = $cuota_ctrl->obtener_cuotas($inventarioid);
			*/

			/* Registrar en la bitacora */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();

			//Registrar en la bitacora la edicion del vale
			if ($estado == 6) {

				//Registrar que el vale se ha finalizado

				$resultado = $bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha finalizado el vale No. $no_vale", $inventarioid);

				/* Actualizar la el restante de la cuota de combustible */


			}elseif ($estado == 7) {

				//Registrar que el vale se ha anulado
				$resultado = $bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha anulado el vale No. $no_vale", $inventarioid);

			}

			$vales = $this->obtener_vales_vehiculo($inventarioid);

			$bitacora = $bitacora_ctrl->obtener_eventos($inventarioid);

			return array($vales, $bitacora);
		}

		//Obtener vales restantes
		function vales_restantes(){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT COUNT(VALEID) FROM ADM_VALES WHERE ESTADO = 4";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$vales_restantes = oci_fetch_object($stid);

			return $vales_restantes;
		}

		//Se verifica si existen vales pendientes de entrega
		function vales_pendientes_entrega($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT ROWNUM FROM ADM_VALES WHERE INVENTARIOID = $id AND ESTADO IN (5, 8)";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$data = oci_fetch_object($stid);

			return $data;
		}

		function responsable_selected($nit){

			/* Conectar a BD */
			$dbc = new Oracle();
			$conn = $dbc->connect();
		}

		/* Se obtienen los detalles del vale para mostrarlos en el Modulo Vales */
		function obtener_vale($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query = "SELECT ADM_VALES.VALEID, ADM_VALES.NO_GESTION, ADM_VALES.NO_VALE, ADM_VALES.FECHA, ADM_VALES.HORA, ADM_VALES.GASOLINERA, ADM_VALES.ESTADO, ADM_VALES.INVENTARIOID, ADM_VALES.CONSUMO, ADM_VALES.DEPARTAMENTO, ADM_VALES.DIRECCION, ADM_VALES.CUOTAID, ADM_VALES.KILOMETRAJE, ADM_VALES.COMISION, TO_CHAR(ADM_VALES.FECHA_ENTREGA, 'DD/MM/YYYY HH24:MI') AS FECHA_ENTREGA, ADM_VALES.PERSONA_ENTREGA, TO_CHAR(ADM_VALES.FECHA_DESPACHO, 'DD/MM/YYYY') AS FECHA_DESPACHO,
					ADM_FICHA_VEHICULOS.PLACA, ADM_FICHA_VEHICULOS.COLOR, ADM_FICHA_VEHICULOS.TIPO, ADM_FICHA_VEHICULOS.MARCA,
					ADM_FICHA_VEHICULOS.TIPO_COMBUSTIBLE, ADM_FICHA_VEHICULOS.MODELO, ADM_FICHA_VEHICULOS.LINEA, RH_EMPLEADOS.NOMBRE, RH_EMPLEADOS.APELLIDO, RH_EMPLEADOS.NIT, CONCAT(CONCAT(RH_EMPLEADOS.NOMBRE , ' '), RH_EMPLEADOS.APELLIDO) AS RESPONSABLE
					FROM ADM_VALES
					INNER JOIN ADM_FICHA_VEHICULOS
					ON ADM_VALES.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
					INNER JOIN RH_EMPLEADOS
					ON ADM_VALES.RESPONSABLE = RH_EMPLEADOS.NIT
					WHERE ADM_VALES.VALEID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$data = oci_fetch_object($stid);

			$documento_ctrl = new DocumentosController();
			$documentos = $documento_ctrl->obtener_documentos_vale($id);

			return array($data, $documentos);
		}

		function entrega_vale($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$fecha_entrega = $request["FECHA"];
			$persona_entrega = $request["RESPONSABLE"];
			$id_vale = $request["ID_VALE"];
			$inventario_id = $request["INVENTARIO_ID"];

			$query = "UPDATE ADM_VALES SET FECHA_ENTREGA = TO_DATE('$fecha_entrega', 'DD/MM/YYYY HH24:MI'), PERSONA_ENTREGA = '$persona_entrega', ESTADO = 8 WHERE VALEID = $id_vale";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$vales = $this->obtener_vales_vehiculo($inventario_id);



			return $vales;

		}

		function vales_disponibles(){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "	SELECT *
						FROM ADM_VALES
						WHERE ESTADO IN (4, 9)
						ORDER BY VALEID";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);
			
			$json = array();

			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$json[] = $data;
			}

			return $json;
		
		}

		function cambiar_estado_vale($request){

			$valeid = $request["VALEID"];
			$estado = $request["ESTADO"];

			$dbc = new Oracle();
			$conn = $dbc->connect();

			if ($estado == "4") {

				$query = "UPDATE ADM_VALES SET ESTADO = 9 WHERE VALEID = $valeid";

			}else{

				$query = "UPDATE ADM_VALES SET ESTADO = 4 WHERE VALEID = $valeid";

			}

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			return $request;

		}

	}

?>

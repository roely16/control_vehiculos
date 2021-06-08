<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Bitacora_EventosController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/VehiculoController.php';

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/mail/mail.php';

	class HistorialController{

		protected $conn;

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();
		}

		function obtener_historial($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT HISTORIALID, TO_CHAR(FECHA_SALIDA, 'dd/mm/yyyy') AS FECHA_SALIDA, TO_CHAR(HORA_SALIDA, 'HH24:MI:SS') AS HORA_SALIDA, KM_SALIDA, TO_CHAR(FECHA_ENTRADA, 'dd/mm/yyyy') AS FECHA_ENTRADA, TO_CHAR(HORA_ENTRADA, 'HH24:MI:SS') AS HORA_ENTRADA, KM_ENTRADA, INVENTARIOID FROM ADM_HISTORIAL_VEHICULOS WHERE INVENTARIOID = $id ORDER BY TO_DATE(FECHA_SALIDA, 'dd/mm/yyyy') DESC, HISTORIALID DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$historial = array();
			$i = 0;

			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$historial[] = $data;
				$i++;
			}

			return $historial;
		}
		
		function registrar_historial($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$inventarioid = $request["INVENTARIOID"];
			$hora_salida = date('H:i:s', strtotime($request["HORA_SALIDA"]));
			$hora_entrada = date('H:i:s', strtotime($request["HORA_ENTRADA"]));
			$km_salida = $request["KM_SALIDA"];
			$km_entrada = $request["KM_ENTRADA"];
			$responsable = $request["RESPONSABLE"];
			$observacion = $request["OBSERVACION"];
			$km_actual = $request["KM_ACTUAL"];
			$fecha_salida = date('d/mm/y', strtotime($request["FECHA_SALIDA"]));
			$fecha_salida_ = $request["FECHA_SALIDA"];
			$fecha_entrada_ = $request["FECHA_ENTRADA"];
			$fecha_entrada = date('d/m/y', strtotime($request["FECHA_ENTRADA"]));
			$no_vale = $request["NO_VALE"];
			$galones = $request["GALONES"];
			$no_viajes = $request["NO_VIAJES"];
			$personas = $request["PERSONAS"];
			$visitas_campo = $request["VISITAS_CAMPO"];
			$juridico = $request["JURIDICO"];
			$tecnico = $request["TECNICO"];
			$sima = $request["SIMA"];
			$iusi = $request["IUSI"];
			$avisos_not = $request["AVISOS_NOT"];
			$expedientes = $request["EXPEDIENTES"];
			$cartas = $request["CARTAS"];
			$udi = $request["UDI"];
			$admin = $request["ADMINISTRACION"];
			$regencia = $request["REGENCIA"];
			$otros = $request["OTROS"];
			$km_servicio = $request["KM_SERVICIO"];
//die("$km_actual < $km_entrada && $km_salida >= $km_actual");
			/* Verificar que el Km de entrada sea mayor al Km actual */

			/* Ingresa el mismo dia */


			//if ($km_actual < $km_entrada && $km_salida >= $km_actual) {
           // die("$km_salida >= $km_actual");
			//	if ($km_salida <= $km_actual) {
					if (true) {

				/* Comienza IF */

				if ($km_entrada > $km_salida) {

					/* Registrar en el historial del vehiculo */

					$query = "INSERT INTO ADM_HISTORIAL_VEHICULOS (HORA_SALIDA, KM_SALIDA, HORA_ENTRADA, KM_ENTRADA, RESPONSABLE, OBSERVACION, INVENTARIOID, FECHA_SALIDA, FECHA_ENTRADA, NO_VALE, GALONES, NO_VIAJES, PERSONAS, VISITAS_CAMPO, JURIDICO, TECNICO, SIMA, IUSI, AVISOS_NOT, EXPEDIENTES, CARTAS, UDI, ADMINISTRACION, REGENCIA, OTROS) VALUES (TO_DATE('$hora_salida', 'HH24:MI:SS'), '$km_salida', TO_DATE('$hora_entrada', 'HH24:MI:SS'), '$km_entrada', '$responsable', '$observacion', $inventarioid, TO_DATE('$fecha_salida_', 'DD/MM/YYYY'), TO_DATE('$fecha_entrada_', 'DD/MM/YYYY'), '$no_vale', '$galones', '$no_viajes', '$personas', '$visitas_campo', '$juridico', '$tecnico', '$sima', '$iusi', '$avisos_not', '$expedientes', '$cartas', '$udi', '$admin', '$regencia', '$otros')";

					$stid = oci_parse($conn, $query);
					oci_execute($stid);
                    $km_salida = $km_actual;
                    
					/* Actualizar Kilometraje del vehiculo  no es necesario actualizar ya que se actualiza segun los vales */ 
					//$vehiculo_ctrl = new VehiculoController();
					//$vehiculo_ctrl->actualizar_kilometraje($inventarioid, $km_entrada);

					/* Actualizar la bitacora */
					$bitacora_ctrl = new Bitacora_EventosController();
					$usuario = $bitacora_ctrl->obtener_usuario();
					$evento = "El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " registro en historial de entradas y salidas";
					$bitacora_ctrl->registrar_evento($evento, $inventarioid);

					/* Obtener la bitacora */
					$bitacora = $bitacora_ctrl->obtener_eventos($inventarioid);

					$historial = $this->obtener_historial($inventarioid);

					/* Validar si se debe enviar correo para envio a mantenimiento */

					
					$res_km = $km_servicio - $km_entrada;

					if ($res_km <= 1000) {
						
						/* Verificar si ya se aviso sobre realizar el mantenimiento */
						$query = "SELECT NOTIFICACION_SERVICIO, KM_RECORDATORIO FROM ADM_FICHA_VEHICULOS WHERE INVENTARIOID = $inventarioid";
						$stid = oci_parse($this->conn, $query);
						oci_execute($stid);
						$vehiculo = oci_fetch_object($stid);

						/* No se ha notificado */
						if ($vehiculo->NOTIFICACION_SERVICIO != 1) {
							
							$text = "El vehículo esta cerca del kilometraje de servicio";
							$mail_text = "<h1>Esta a 1000 Km de realizar el proximo servicio del vehiculo</h1>";
							$mail = new Mail();
							$mail->send_mail('hchur@muniguate.com', 'Mantenimiento de Vehículo', $mail_text);

							/* Actualizar campo de notificacion y colocar el kilometraje del recordatorio*/
							$km_recordatorio = $km_entrada + 200;

							$query = "UPDATE ADM_FICHA_VEHICULOS SET NOTIFICACION_SERVICIO = 1, KM_RECORDATORIO = $km_recordatorio WHERE INVENTARIOID = $inventarioid";
                            
							$stid = oci_parse($this->conn, $query);
							oci_execute($stid);


						}else if($vehiculo->NOTIFICACION_SERVICIO == 1){

							if($km_entrada >= $vehiculo->KM_RECORDATORIO){

								/* Enviar correo de recordatorio */
								$text = "El vehículo esta cerca del kilometraje de servicio";
								$mail_text = "<h1>Recordatorio de Mantenimiento</h1>";
								$mail = new Mail();
								$mail->send_mail('hchur@muniguate.com', 'Mantenimiento de Vehículo', $mail_text);

								/* Actualizar kilometra del proximo recordatorio */
								$km_recordatorio = $km_entrada + 200;
								$query = "UPDATE ADM_FICHA_VEHICULOS SET KM_RECORDATORIO = $km_recordatorio WHERE INVENTARIOID = $inventarioid";
                                
								$stid = oci_parse($this->conn, $query);
								oci_execute($stid);
                                

							}

						}

						$text = "El vehículo esta cerca del kilometraje de servicio";

						

					}else{

						$text = "El vehículo no esta cerca del kilometraje de servicio";

					}
					

					return array(1, $historial, $km_actual, $bitacora, $usuario, $res_km, $text);

				}

				/*elseif($hora_salida > $hora_entrada){

					return array(2, $hora_salida, $hora_entrada, strtotime($hora_salida), strtotime($hora_entrada));

				}elseif($km_salida > $km_entrada){

					return array(0, $hora_salida, $hora_entrada, strtotime($hora_salida), strtotime($hora_entrada));

				}
				*/

				/* Termina IF */

			}elseif($km_salida < $km_actual){

				return array(4);

			}else{

				return array(3);

			}
		}

		function detalle_historial($id){

			$query = "SELECT ADM_HISTORIAL_VEHICULOS.HISTORIALID, ADM_HISTORIAL_VEHICULOS.INVENTARIOID, TO_CHAR(ADM_HISTORIAL_VEHICULOS.FECHA_SALIDA, 'DD/MM/YYYY') AS FECHA_SALIDA, TO_CHAR(ADM_HISTORIAL_VEHICULOS.HORA_SALIDA, 'HH24:MI:SS') AS HORA_SALIDA, 
				ADM_HISTORIAL_VEHICULOS.KM_SALIDA, TO_CHAR(ADM_HISTORIAL_VEHICULOS.FECHA_ENTRADA, 'DD/MM/YYYY') AS FECHA_ENTRADA, TO_CHAR(ADM_HISTORIAL_VEHICULOS.HORA_ENTRADA, 'HH24:MI:SS') AS HORA_ENTRADA,
				ADM_HISTORIAL_VEHICULOS.KM_ENTRADA, CONCAT(CONCAT(RH_EMPLEADOS.NOMBRE, ' '), RH_EMPLEADOS.APELLIDO) AS NOMBRE, ADM_HISTORIAL_VEHICULOS.OBSERVACION,
				ADM_HISTORIAL_VEHICULOS.NO_VALE, ADM_HISTORIAL_VEHICULOS.GALONES, ADM_HISTORIAL_VEHICULOS.NO_VIAJES, ADM_HISTORIAL_VEHICULOS.PERSONAS,
				ADM_HISTORIAL_VEHICULOS.VISITAS_CAMPO, ADM_HISTORIAL_VEHICULOS.JURIDICO, ADM_HISTORIAL_VEHICULOS.TECNICO, ADM_HISTORIAL_VEHICULOS.SIMA, 
				ADM_HISTORIAL_VEHICULOS.IUSI, ADM_HISTORIAL_VEHICULOS.AVISOS_NOT, ADM_HISTORIAL_VEHICULOS.EXPEDIENTES, ADM_HISTORIAL_VEHICULOS.CARTAS, ADM_HISTORIAL_VEHICULOS.UDI, 
				ADM_HISTORIAL_VEHICULOS.ADMINISTRACION, ADM_HISTORIAL_VEHICULOS.REGENCIA, ADM_HISTORIAL_VEHICULOS.OTROS 
				FROM ADM_HISTORIAL_VEHICULOS 
				INNER JOIN RH_EMPLEADOS
				ON ADM_HISTORIAL_VEHICULOS.RESPONSABLE = RH_EMPLEADOS.NIT
				WHERE HISTORIALID = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$registro = oci_fetch_object($stid);
			
			return $registro;
		}

		function editar_historial($request){

			$historial_id = $request["HISTORIALID"];
			$observacion = $request["OBSERVACION"];
			$no_vale = $request["NO_VALE"];
			$galones = $request["GALONES"];
			$no_viajes = $request["NO_VIAJES"];
			$personas = $request["PERSONAS"];
			$visitas_campo = $request["VISITAS_CAMPO"];
			$juridico = $request["JURIDICO"];
			$tecnico = $request["TECNICO"];
			$sima = $request["SIMA"];
			$iusi = $request["IUSI"];
			$avisos_not = $request["AVISOS_NOT"];
			$expedientes = $request["EXPEDIENTES"];
			$cartas = $request["CARTAS"];
			$udi = $request["UDI"];
			$admin = $request["ADMINISTRACION"];
			$regencia = $request["REGENCIA"];
			$otros = $request["OTROS"];
			$inventario_id = $request["INVENTARIOID"];

			/* Extras */
			$km_entrada = $request["KM_ENTRADA"];
			$km_salida = $request["KM_SALIDA"];

			$query = "UPDATE ADM_HISTORIAL_VEHICULOS SET OBSERVACION = '$observacion', NO_VALE = '$no_vale', GALONES = '$galones', NO_VIAJES = '$no_viajes', PERSONAS = '$personas', VISITAS_CAMPO = '$visitas_campo', JURIDICO = '$juridico', TECNICO = '$tecnico', SIMA = '$sima', IUSI = '$iusi', AVISOS_NOT = '$avisos_not', EXPEDIENTES = '$expedientes', CARTAS = '$cartas', UDI = '$udi', ADMINISTRACION = '$admin', REGENCIA = '$regencia', OTROS = '$otros', KM_SALIDA = '$km_salida', KM_ENTRADA = '$km_entrada'  WHERE HISTORIALID = $historial_id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			/* Actualizar la bitacora */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$evento = "El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha editado el registro ID " .$historial_id. " en el historial de entradas y salidas";

			$bitacora_ctrl->registrar_evento($evento, $inventario_id);

			/* Obtener la bitacora */
			$bitacora = $bitacora_ctrl->obtener_eventos($inventario_id);

			/* Obtener el historial */
			$historial = $this->obtener_historial($inventario_id);

			return array($historial_id, $bitacora, $historial);
		}

		function eliminar_historial($id, $inventario_id){

			/* Obtener ultimo kilometraje */
			$query = "SELECT KM_SALIDA, KM_ENTRADA FROM ADM_HISTORIAL_VEHICULOS WHERE HISTORIALID = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$km_salida = oci_fetch_array($stid);
			$km_salida_ = $km_salida["KM_SALIDA"];
			$km_entrada = $km_salida["KM_ENTRADA"];

			/* Eliminar registro */
			$query = "DELETE FROM ADM_HISTORIAL_VEHICULOS WHERE HISTORIALID = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);


			/* Actualizar kilometraje del vehículo */
			$query = "UPDATE ADM_FICHA_VEHICULOS SET KM_ACTUAL = $km_salida_ WHERE INVENTARIOID = $inventario_id";
            /*
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);
*/
			/* Obtener historial */
			$historial = $this->obtener_historial($inventario_id);

			/* Actualizar la bitacora */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$evento = "El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha eliminado un registro en historial de entradas y salidas, el kilometraje disminuyo de " .$km_entrada. " a " . $km_salida_;
			$bitacora_ctrl->registrar_evento($evento, $inventario_id);

			/* Obtener la bitacora */
			$bitacora = $bitacora_ctrl->obtener_eventos($inventario_id);

			return array($historial, $bitacora, $km_salida_);
		}

		function buscar_piloto($nombre){

			$query = "SELECT * FROM RH_EMPLEADOS WHERE 
			UPPER(CONCAT(CONCAT(NIT, ' '), CONCAT(CONCAT(NOMBRE, ' '), APELLIDO))) LIKE UPPER('%$nombre%')
			AND NIT NOT IN (SELECT EMPLEADONIT FROM ADM_ROLES) AND STATUS = 'A'";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$empleados = array();

			
			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {
			
				$empleados[] = $data;

			}

			return $empleados;
		}

		function registrar_piloto($nit_piloto){

			$query = "INSERT INTO ADM_ROLES (EMPLEADONIT, PILOTO) VALUES ('$nit_piloto', 1)";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$vehiculo_ctrl = new VehiculoController();
			$pilotos = $vehiculo_ctrl->obtener_pilotos();

			$query = "SELECT CONCAT(CONCAT(NIT, ' '), CONCAT(CONCAT(NOMBRE, ' '), APELLIDO)) AS PILOTO, NIT FROM RH_EMPLEADOS WHERE NIT = '$nit_piloto'";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$piloto = oci_fetch_array($stid);

			return array($pilotos, $piloto);
		}
		
	}

?>
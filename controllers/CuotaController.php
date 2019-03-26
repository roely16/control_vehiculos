<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Bitacora_EventosController.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';

	class CuotaController{

		function establecer_cuota($request){

			$inventarioid = $request["INVENTARIOID"];

			$fecha_inicio = date('d/m/y', strtotime($request["FECHA_INICIO"]));
			$fecha_fin = date('d/m/y', strtotime($request["FECHA_FIN"]));

			$cuota = $request["CUOTA"];

			//$r = date_diff($fecha_inicio, $fecha_fin);

			if (strtotime($request["FECHA_INICIO"]) < strtotime($request["FECHA_FIN"])) {
				
				//Validar que no exista una cuota en el mismo rango de fecha 

				/* Obtener ultima cuota de combustible */
				$data = $this->obtener_ultima_cuota($inventarioid);

				/* 
				Validar que la cuota que se desea registrar tenga fecha de inicio
				superior a la fecha fin de la ultima cuota
				*/

				/* Validar si es la primera cuota */

				/* Ya existe una cuota */
				if ($data == true) {
					
					/* 
					Valida que la fecha de inicio de la cuota sea mayor a la de la 
					ultima cuota creada 
					*/

					$fecha_fin_f = str_replace('/', '-', $data->FECHA_FIN);

					//$fecha_inicio = date('d-m-Y', strtotime($request["FECHA_INICIO"]));
					//$fecha_fin_ = date('d/m/Y', strtotime($data->FECHA_FIN));

					if (strtotime($request["FECHA_INICIO"]) < strtotime($fecha_fin_f)) {
					
						/*
						La fecha ingresada no es valida, pues es menor a la fecha 
						en que termina la ultima cuota
						*/

						return array('cuota_existente', $data, $fecha_inicio, $fecha_fin);

					}else{

						/*
						La fecha de inicio es valida
						*/

						/*
						Cambiar el estado de la ultima cuota a INACTIVA
						*/

						//Conectar a la base de datos
						$dbc = new Oracle();
						$conn = $dbc->connect();

						$query = "UPDATE ADM_CUOTAS_COMBUSTIBLE SET ESTADO = 0 WHERE CUOTAID = $data->CUOTAID ";

						$stid = oci_parse($conn, $query);
						oci_execute($stid);

						/*
						Registrar la cuota como ACTIVA
						*/

						$query_ = "INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, RESTANTE, ESTADO) VALUES ('$fecha_inicio', '$fecha_fin', $cuota, $inventarioid, $cuota, 1)";

						$stid = oci_parse($conn, $query_);
						oci_execute($stid);

					}

				/*
				No existe una cuota de combustible		
				*/	

				}else{
					//Conectar a la base de datos
					$dbc = new Oracle();
					$conn = $dbc->connect();

					$query = "INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, RESTANTE, ESTADO) VALUES ('$fecha_inicio', '$fecha_fin', $cuota, $inventarioid, $cuota, 1)";

					$stid = oci_parse($conn, $query);
					oci_execute($stid);
					
				}


				//Registrar en la bitacora
				$bitacora_ctrl = new Bitacora_EventosController();
				$usuario = $bitacora_ctrl->obtener_usuario();
				$resultado = $bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO." ha una registrado nueva cuota de combustible de $cuota galones con fecha de inicio $fecha_inicio y fecha de fin $fecha_fin", $inventarioid);

				//Obtener las cuotas para actualizar la tabla
				$cuotas = $this->obtener_cuotas($inventarioid);

				//Obtener la bitacora para actualizar la tabla
				$bitacora = $bitacora_ctrl->obtener_eventos($inventarioid);

				return array(1, $cuotas, $bitacora, $data, $fecha_inicio, $fecha_fin);
				
			}else{

				return array('rango_invalido');

			}
		}

		function obtener_cuotas($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM ADM_CUOTAS_COMBUSTIBLE WHERE INVENTARIOID = $id ORDER BY CUOTAID DESC";

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

				$stid = oci_parse($conn, $query);
				oci_execute($stid);

				$consumo = oci_fetch_array($stid);

				$data["CONSUMO"] = $consumo["CONSUMO"];

				$cuotas[] = $data;


			}

			return $cuotas;
		}

		function obtener_cuota($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yyyy'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query = "SELECT * FROM ADM_CUOTAS_COMBUSTIBLE WHERE CUOTAID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$data = oci_fetch_object($stid);

			return $data;
		}

		function editar_cuota($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$cuotaid = $request["CUOTAID"];
			$cuota = $request["CUOTA"];
			$inventarioid = $request["INVENTARIOID"];

			$query = "UPDATE ADM_CUOTAS_COMBUSTIBLE SET CUOTA = $cuota WHERE CUOTAID = $cuotaid";

			$stid = oci_parse($conn, $query);

			oci_execute($stid);

			/* Registrar en la bitacora */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO." ha edita la cuota de combustible activa", $inventarioid);

			$bitacora = $bitacora_ctrl->obtener_eventos($inventarioid);

			$cuotas = $this->obtener_cuotas($inventarioid);

			return array($cuotas, $bitacora);
		}

		function obtener_cuota_activa($inventario_id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM ADM_CUOTAS_COMBUSTIBLE WHERE INVENTARIOID = $inventario_id AND ESTADO = 1";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$cuota = oci_fetch_object($stid);

			return $cuota;
		}

		function obtener_ultima_cuota($inventario_id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT CUOTA, TO_CHAR(FECHA_INICIO, 'DD/MM/YYYY') AS FECHA_INICIO, TO_CHAR(FECHA_FIN, 'DD/MM/YYYY') AS FECHA_FIN,  CUOTAID    
				FROM ADM_CUOTAS_COMBUSTIBLE 
				WHERE INVENTARIOID = $inventario_id AND ROWNUM = 1 AND ESTADO = 1 ORDER BY CUOTAID DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$cuota = oci_fetch_object($stid);

			return $cuota;
		}

		function eliminar_cuota($id, $inventario_id){

			/* Conectar a la base de datos */
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "DELETE FROM ADM_CUOTAS_COMBUSTIBLE WHERE CUOTAID = $id";

			$stid = oci_parse($conn, $query);	
			oci_execute($stid);

			/* Retornar las cuotas para actualizar la tabla */
			$cuotas = $this->obtener_cuotas($inventario_id);

			/* Escribir en bitacora */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha eliminado una cuota de combustible", $inventario_id);

			/* Retornar bitacora para actualizar la tabla */
			$bitacora = $bitacora_ctrl->obtener_eventos($inventario_id);

			return array($cuotas, $bitacora, $usuario);
		}

		function obtener_todas_cuotas(){

			/* Conectar a la base de datos */
			$dbc = new Oracle();
			$conn = $dbc->connect();

			/* Cambiar Formato de Fecha */
			$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yyyy'";
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query_sysdate = "ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'"; 
			$stid = oci_parse($conn, $query_sysdate);
			oci_execute($stid);

			$query = "	SELECT ADM_CUOTAS_COMBUSTIBLE.*, ADM_FICHA_VEHICULOS.* 
						FROM ADM_CUOTAS_COMBUSTIBLE
						INNER JOIN ADM_FICHA_VEHICULOS 
						ON ADM_CUOTAS_COMBUSTIBLE.INVENTARIOID = ADM_FICHA_VEHICULOS.INVENTARIOID
						ORDER BY ADM_CUOTAS_COMBUSTIBLE.FECHA_FIN DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$cuotas = array();
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				
				$fecha_inicio = $data["FECHA_INICIO"];
				$fecha_fin = $data["FECHA_FIN"];
				$inventario_id = $data["INVENTARIOID"];

				$query = "SELECT SUM(CONSUMO) AS CONSUMO FROM ADM_VALES WHERE FECHA
							BETWEEN TO_DATE ('$fecha_inicio', 'dd/mm/yyyy') AND TO_DATE ('$fecha_fin', 'dd/mm/yyyy')
							AND ADM_VALES.INVENTARIOID = $inventario_id";

				$stid_ = oci_parse($conn, $query);
				oci_execute($stid_);

				$consumo = oci_fetch_array($stid_);

				$data["CONSUMO"] = $consumo["CONSUMO"];
				
				$cuotas[] = $data;

			}

			return $cuotas;
		}

		function registrar_cuotas($request){

			$fecha_inicio = str_replace('/', '-', $request[0]["fecha_inicio"]);
			$fecha_fin = str_replace('/', '-', $request[1]["fecha_fin"]);

			/* Validacion rango de fechas superior a ultima cuota */
			$cuota = $this->ultima_cuota_general();


			if (strtotime($fecha_inicio) < strtotime($fecha_fin)) {
				
				if (strtotime($fecha_inicio) <= strtotime($cuota->FECHA_FIN)) {
				
					//return 'Fecha de inicio  menor a fecha fin de ultima cuota, no registrar';

					return array(1);

				}else{

					//return 'Fecha de inicio mayor a fecha fin de ultima cuota, registrar';

					$total = count($request);

					$dbc = new Oracle();
					$conn = $dbc->connect();

					$query_sysdate = "ALTER SESSION SET nls_date_format = 'dd/mm/yyyy'";
					$stid = oci_parse($conn, $query_sysdate);
					oci_execute($stid);

					$fecha_inicio = $request[0]["fecha_inicio"];
					$fecha_fin = $request[1]["fecha_fin"];

					for ($i=2; $i < $total; $i++) { 
						
						$cuota = $request[$i]["cuota"];
						$inventario_id = $request[$i]["inventario_id"];

						$query = "INSERT INTO ADM_CUOTAS_COMBUSTIBLE (FECHA_INICIO, FECHA_FIN, CUOTA, INVENTARIOID, ESTADO) VALUES ('$fecha_inicio', '$fecha_fin', $cuota, $inventario_id, 1)";

						$stid = oci_parse($conn, $query);
						oci_execute($stid);

						$bitacora_ctrl = new Bitacora_EventosController();
						$usuario = $bitacora_ctrl->obtener_usuario();
						$bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO." ha una registrado nueva cuota de combustible de $cuota galones con fecha de inicio $fecha_inicio y fecha de fin $fecha_fin", $inventario_id);

					}

					$cuotas = $this->obtener_todas_cuotas();
						
					return array($cuotas);

				}

			}else{

				//return 'Fecha de inicio mayor a fecha fin, no registrar';

				return array(2);

			}

			

			/*
			;
			*/
		}

		function eliminar_cuota_modulo($id, $inventario_id){

			/* Conectar a la base de datos */
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "DELETE FROM ADM_CUOTAS_COMBUSTIBLE WHERE CUOTAID = $id";

			$stid = oci_parse($conn, $query);	
			oci_execute($stid);

			/* Retornar las cuotas para actualizar la tabla */
			$cuotas = $this->obtener_todas_cuotas();

			/* Escribir en bitacora */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha eliminado una cuota de combustible", $inventario_id);

			/* Retornar bitacora para actualizar la tabla */
			$bitacora = $bitacora_ctrl->obtener_eventos($inventario_id);

			return array($cuotas, $usuario);
		}

		function editar_cuota_modulo($request){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$cuotaid = $request["CUOTAID"];
			$cuota = $request["CUOTA"];
			$inventarioid = $request["INVENTARIOID"];

			$query = "UPDATE ADM_CUOTAS_COMBUSTIBLE SET CUOTA = $cuota WHERE CUOTAID = $cuotaid";

			$stid = oci_parse($conn, $query);

			oci_execute($stid);

			/* Registrar en la bitacora */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$bitacora_ctrl->registrar_evento("El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO." ha edita la cuota de combustible activa", $inventarioid);

			$cuotas = $this->obtener_todas_cuotas();

			return array($cuotas);
		}

		function ultima_cuota_general(){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT CUOTA, TO_CHAR(FECHA_INICIO, 'DD-MM-YYYY') AS FECHA_INICIO, TO_CHAR(FECHA_FIN, 'DD-MM-YYYY') AS FECHA_FIN,  CUOTAID    
                FROM ADM_CUOTAS_COMBUSTIBLE 
                WHERE ROWNUM = 1 AND ESTADO = 1 ORDER BY CUOTAID DESC";

            $stid = oci_parse($conn, $query);
            oci_execute($stid);

            $cuota = oci_fetch_object($stid);

            return $cuota;
		}

		function obtener_fechas_cuotas($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT TO_CHAR(FECHA_INICIO, 'dd-mm-yyyy') AS FECHA_INICIO, TO_CHAR(FECHA_FIN, 'dd-mm-yyyy') AS FECHA_FIN FROM ADM_CUOTAS_COMBUSTIBLE WHERE INVENTARIOID = $id AND ESTADO = 1 ORDER BY CUOTAID DESC";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$cuotas = array();
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$fecha_inicio = strtotime($data["FECHA_INICIO"]);
				$fecha_fin = strtotime($data["FECHA_FIN"]);
				
				while (strtotime($data["FECHA_INICIO"]) <= strtotime($data["FECHA_FIN"])) {
					
					$cuotas[] = date('j-n-Y', strtotime($data["FECHA_INICIO"]));

					$data["FECHA_INICIO"] = date('d-m-Y', strtotime($data["FECHA_INICIO"] . "+1 days"));

				}
				
			}

			return $cuotas;

		}

	}

?>
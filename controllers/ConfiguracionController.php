<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';

	class ConfiguracionController {

		protected $conn;

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();
		}

		function obtener_configuracion(){

			$administradores = $this->obtener_administradores();
			$roles = $this->obtener_roles();

			return array($administradores, $roles);
		}

		function obtener_administradores(){

			$query = "SELECT ADM_ROLES.ROLID, CONCAT(CONCAT(RH_EMPLEADOS.NOMBRE, ' '), RH_EMPLEADOS.APELLIDO) AS NOMBRE, RH_EMPLEADOS.NIT FROM ADM_ROLES INNER JOIN RH_EMPLEADOS ON ADM_ROLES.EMPLEADONIT = RH_EMPLEADOS.NIT AND ADM_ROLES.ADMINISTRADOR = 1";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			/* Caracteres especiales */
			$unwanted_array = array(    'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
                            'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
                            'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
                            'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
                            'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y' );

			$administradores = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {
				
				$data["NOMBRE"] = strtr( $data["NOMBRE"], $unwanted_array );

				$administradores[] = $data;

			}

			return $administradores;
		}

		function obtener_roles(){

			$query = "SELECT ADM_ROLES.ROLID, ADM_ROLES.EMPLEADONIT, ADM_ROLES.FIRMA_REGISTRADA, ADM_ROLES.PILOTO, ADM_ROLES. SOLICITAR_VALE, ADM_ROLES.ADMINISTRADOR, CONCAT(CONCAT(RH_EMPLEADOS.NOMBRE, ' '), RH_EMPLEADOS.APELLIDO) AS NOMBRE FROM ADM_ROLES INNER JOIN RH_EMPLEADOS ON ADM_ROLES.EMPLEADONIT = RH_EMPLEADOS.NIT ORDER BY ROLID DESC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {
				
				$roles [] = $data;

			}

			return $roles;
		}

		function obtener_vehiculos_administrador($nit){

			$query = "SELECT * FROM ADM_ADMINISTRADOR_VEHICULO INNER JOIN ADM_FICHA_VEHICULOS ON ADM_ADMINISTRADOR_VEHICULO.VEHICULOID = ADM_FICHA_VEHICULOS.INVENTARIOID WHERE ADM_ADMINISTRADOR_VEHICULO.ADMINISTRADOR = '$nit'";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$vehiculos = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {
				
				$vehiculos [] = $data;

			}

			return $vehiculos;
		}

		function obtener_roles_responsable($id){

			$query = "SELECT * FROM ADM_ROLES WHERE ROLID = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$rol = oci_fetch_array($stid);

			$nit = $rol["EMPLEADONIT"];

			$query = "SELECT CONCAT(CONCAT(NOMBRE, ' '), APELLIDO) AS NOMBRE, NIT FROM RH_EMPLEADOS WHERE NIT = '$nit'";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$empleado = oci_fetch_array($stid);

			return array($rol, $empleado);
		}

		function editar_roles($request){

			$rol_id = $request["ROLID"];
			$empleado_nit = $request["EMPLEADONIT"];
			$firma_registrada = $request["FIRMA_REGISTRADA"];
			$piloto = $request["PILOTO"];
			$solicitar_vale = $request["SOLICITAR_VALE"];
			$administrador = $request["ADMINISTRADOR"];

			if ($firma_registrada == '1') {
				
				$query = "UPDATE ADM_ROLES SET FIRMA_REGISTRADA = 1 WHERE ROLID = $rol_id AND EMPLEADONIT = '$empleado_nit'";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}else{

				$query = "UPDATE ADM_ROLES SET FIRMA_REGISTRADA = '' WHERE ROLID = $rol_id AND EMPLEADONIT = '$empleado_nit'";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			if($piloto == '1'){

				$query = "UPDATE ADM_ROLES SET PILOTO = 1 WHERE ROLID = $rol_id AND EMPLEADONIT = '$empleado_nit'";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}else{

				$query = "UPDATE ADM_ROLES SET PILOTO = '' WHERE ROLID = $rol_id AND EMPLEADONIT = '$empleado_nit'";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			if($solicitar_vale == '1'){

				$query = "UPDATE ADM_ROLES SET SOLICITAR_VALE = 1 WHERE ROLID = $rol_id AND EMPLEADONIT = '$empleado_nit'";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}else{

				$query = "UPDATE ADM_ROLES SET SOLICITAR_VALE = '' WHERE ROLID = $rol_id AND EMPLEADONIT = '$empleado_nit'";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			if($administrador == '1'){

				$query = "UPDATE ADM_ROLES SET ADMINISTRADOR = 1 WHERE ROLID = $rol_id AND EMPLEADONIT = '$empleado_nit'";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$administradores = $this->obtener_administradores();

			}else{

				$query = "UPDATE ADM_ROLES SET ADMINISTRADOR = '' WHERE ROLID = $rol_id AND EMPLEADONIT = '$empleado_nit'";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$administradores = $this->obtener_administradores();

			}

			$roles = $this->obtener_roles();

			return array($roles, $administradores);
		}

		function registrar_rol($request){

			$nit = $request["NIT"][0];

			$query = "INSERT INTO ADM_ROLES (EMPLEADONIT) VALUES ('$nit')";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = $request["ROLES"];

			foreach ($roles as $rol) {
				

				if ($rol == 'FIRMA_REGISTRADA') {
					
					$query = "UPDATE ADM_ROLES SET FIRMA_REGISTRADA = 1 WHERE EMPLEADONIT = '$nit'";
					$stid = oci_parse($this->conn, $query);
					oci_execute($stid);

				}else if($rol == 'PILOTO'){

					$query = "UPDATE ADM_ROLES SET PILOTO = 1 WHERE EMPLEADONIT = '$nit'";
					$stid = oci_parse($this->conn, $query);
					oci_execute($stid);

				}else if($rol == 'SOLICITAR_VALE'){

					$query = "UPDATE ADM_ROLES SET SOLICITAR_VALE = 1 WHERE EMPLEADONIT = '$nit'";
					$stid = oci_parse($this->conn, $query);
					oci_execute($stid);
					
				}else if($rol == 'ADMINISTRADOR'){

					$query = "UPDATE ADM_ROLES SET ADMINISTRADOR = 1 WHERE EMPLEADONIT = '$nit'";
					$stid = oci_parse($this->conn, $query);
					oci_execute($stid);

					$administradores = $this->obtener_administradores();
					
				}

			}

			$roles = $this->obtener_roles();

			return array($roles, $administradores);
		}

		function eliminar_rol($id){

			$query = "DELETE FROM ADM_ROLES WHERE ROLID = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = $this->obtener_roles();
			$administradores = $this->obtener_administradores();

			return array($roles, $administradores);
			
		}

		function eliminar_vehiculo($id, $nit){

			$query = "DELETE FROM ADM_ADMINISTRADOR_VEHICULO WHERE ID = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$vehiculos = $this->obtener_vehiculos_administrador($nit);

			return $vehiculos;
		}

		function obtener_vehiculos($nit){

			$query = "SELECT * FROM ADM_FICHA_VEHICULOS WHERE INVENTARIOID NOT IN (SELECT DISTINCT VEHICULOID FROM ADM_ADMINISTRADOR_VEHICULO WHERE ADMINISTRADOR = '$nit')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$vehiculos = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {
				
				$vehiculos [] = $data;				

			}

			return $vehiculos;
		}

		function registrar_vehiculo($request){

			$responsable = $request["RESPONSABLE"];
			$vehiculos = $request["VEHICULOS"];

			foreach ($vehiculos as $vehiculo) {
			
				$query = "INSERT INTO ADM_ADMINISTRADOR_VEHICULO (ADMINISTRADOR, VEHICULOID) VALUES ('$responsable', $vehiculo)";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			$vehiculos = $this->obtener_vehiculos_administrador($responsable);


			return $vehiculos;
		}

	}

?>
<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';

	class Eqp_Inventario{

		protected $inventario_id;

		protected $catalogo_id;
		protected $descripcion;

		protected $nit;

		function actualizar_bitacora(){

		}

		function modificar_inventario(){

		}

		function registrar_vehiculo($vehiculo){

		}

		function eliminar_vehiculo($id){

		}

		function obtener_vehiculos(){

			$query = 'SELECT * FROM EQP_INVENTARIO WHERE CATALOGOID = 34';

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$json = array();
			
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$json[] = $data;
			}

			return $json;
		}

		public function obtener_vehiculo($id){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM EQP_INVENTARIO WHERE INVENTARIOID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$data = oci_fetch_object($stid);

			return $data;
			
		}

	}

?>
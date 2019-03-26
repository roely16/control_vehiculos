<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';
	
	class AccesoriosController{

		protected $conn;

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();

		}

		function registrar_accesorio($request){

		}

		function detalles_accesorio($id){

		}

		function editar_accesorio($request){

		}

		function eliminar_accesorio($id){

		}

		function listar_accesorios($id){

		}

		function listar_todos_accesorios(){

		}
		
	}


?>	
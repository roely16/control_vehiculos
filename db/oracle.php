<?php 
	
	include $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/db_config.php';

	class Oracle extends Dbconfig{

		protected $connection;

		function connect(){

			//Creacion de nuevo objetopara obtener los parametros de la bd	
			$dbPara = new Dbconfig();

			$this->connection = oci_connect($dbPara->user, $dbPara->password, $dbPara->dbName, 'UTF8');

			if (!$this->connection) {
		    	$e = oci_error();
		    	trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
			}else{
				return $this->connection;
			}

		}

		function disconnect($conn){

			oci_close($conn);

		}

	}

?>
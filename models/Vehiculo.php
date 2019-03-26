<?php 

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';

	class Vehiculo{

		protected $id_vehiculo;
		
		protected $tipo;
		protected $marca;
		protected $modelo;
		protected $linea;
		protected $color;
		protected $placa;
		protected $combustible;
		protected $no_motor;
		protected $no_chasis;
		protected $no_tarjeta_circ;
		protected $actividad;
		protected $km_actual;
		protected $km_servicio;

		protected $id_estado;
		protected $id_direccion;

		function set_id_vehiculo($id_vehiculo){
			$this->id_vehiculo = $id_vehiculo;
		}

		function get_id_vehiculo(){
			return $this->id_vehiculo;
		}

		function set_tipo($tipo){
			$this->tipo = $tipo;
		}

		function get_tipo(){
			return $this->tipo;
		}

		function set_marca($marca){
			$this->marca = $marca;
		}

		function get_marca(){
			return $this->marca;
		}

		function set_modelo($modelo){
			$this->modelo = $modelo;
		}

		function get_modelo(){
			return $this->modelo;
		}		

		function set_linea($linea){
			$this->linea = $linea;
		}

		function get_linea(){
			return $this->linea;
		}

		function set_color($color){
			$this->color = $color;
		}

		function get_color(){
			return $this->color;
		}

		function set_placa($placa){
			$this->placa = $placa;
		}

		function get_placa(){
			return $this->placa;
		}

		function set_combustible($combustible){
			$this->combustible = $combustible;
		}

		function get_combustible(){
			return $this->combustible;
		}

		function set_no_motor($no_motor){
			$this->no_motor = $no_motor;
		}

		function get_no_motor(){
			return $this->no_motor;
		}

		function set_no_chasis($no_chasis){
			$this->no_chasis = $no_chasis;
		}

		function get_no_chasis(){
			return $this->no_chasis;
		}

		function set_no_tarjeta_circ($no_tarjeta_circ){
			$this->no_tarjeta_circ = $no_tarjeta_circ;
		}

		function get_no_tarjeta_circ(){
			return $this->no_tarjeta_circ;
		}

		function set_actividad($actividad){
			$this->actividad = $actividad;
		}

		function get_actividad(){
			return $this->actividad;
		}

   		function insert($vehiculo){

   			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			//Ejecutar Query
			$stid = oci_parse($conn, "INSERT INTO ADM_VEHICULOS(TIPO, MARCA, MODELO, LINEA, COLOR, PLACA, COMBUSTIBLE, NO_MOTOR, NO_CHASIS, NO_TARJETA_CIRC, ACTIVIDAD) VALUES ('$vehiculo->tipo', '$vehiculo->marca', '$vehiculo->modelo', '$vehiculo->linea', '$vehiculo->color', '$vehiculo->placa', '$vehiculo->combustible', '$vehiculo->no_motor', '$vehiculo->no_chasis', '$vehiculo->no_tarjeta_circ', '$vehiculo->actividad')");

			oci_execute($stid);

			return $stid;

   		}

   		function delete($id){

   		}

   		function update($id, $vehiculo){

   		}

   		function get(){
   			
   			
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM ADM_VEHICULOS";

			$stid = oci_parse($conn, 'SELECT * FROM ADM_VEHICULOS');
			oci_execute($stid);

			$json = array();
			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$json[] = $data;
			}

			return $json;

   		}

	}

?>
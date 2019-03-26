<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';
	require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/controllers/Bitacora_EventosController.php';

	class DocumentosController{

		function mover_documento($request){

			
			$tempPath = $_FILES['file']['tmp_name'];

			$id_archivo = uniqid();

			$uploadPath = $_SERVER['DOCUMENT_ROOT'] . "/administrativo/control_vehiculos/documents/".$id_archivo;
			$archivo = "documents/".$id_archivo;
			$nombre_archivo = $_FILES['file']['name'];
			$tipo_archivo = $_FILES['file']['type'];

			if (move_uploaded_file($tempPath, $uploadPath)) {
				
				return array($archivo, $nombre_archivo, $tipo_archivo);

			}else{

				return array($tempPath);
			}	
		}

		function registrar_documento($request){

			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$directorio = $request["DIRECTORIO"];
			$inventario_id = $request["INVENTARIOID"];
			$nombre_archivo = $request["NOMBRE_ARCHIVO"];
			$tipo_archivo = $request["TIPO_ARCHIVO"];

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "INSERT INTO ADM_DOCUMENTOS (NOMBRE, DESCRIPCION, ARCHIVO, NOMBRE_ARCHIVO, INVENTARIOID, TIPO_ARCHIVO) VALUES ('$nombre', '$descripcion', '$directorio', '$nombre_archivo',$inventario_id, '$tipo_archivo')";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			/* Obtener documentos para actualizar la tabla */
			$documentos = $this->obtener_documentos($inventario_id);

			/* Registrar en la bitacora */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$evento = "El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha subido un documento";
			$bitacora_ctrl->registrar_evento($evento, $inventario_id);
			$bitacora = $bitacora_ctrl->obtener_eventos($inventario_id);

			return array($documentos, $bitacora);			
		}

		function obtener_documentos($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM ADM_DOCUMENTOS WHERE INVENTARIOID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$documentos = array();

			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$documentos[] = $data;
			}

			return $documentos;
		}

		function eliminar_documento($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			/* Obtener el documento y eliminar el archivo */

			$documento = $this->obtener_documento($id);
			unlink( $_SERVER['DOCUMENT_ROOT'] . "/administrativo/control_vehiculos/".$documento->ARCHIVO);

			/* Eliminar el registro en la base de datos */

			$query = "DELETE FROM ADM_DOCUMENTOS WHERE DOCUMENTOID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			/* Obtener documentos para actualizar la tabla */
			$documentos = $this->obtener_documentos($documento->INVENTARIOID);

			/* Registrar en la bitacora */
			$bitacora_ctrl = new Bitacora_EventosController();
			$usuario = $bitacora_ctrl->obtener_usuario();
			$evento = "El usuario " .$usuario->NOMBRE. " " .$usuario->APELLIDO. " ha eliminado el documento";
			$bitacora_ctrl->registrar_evento($evento, $documento->INVENTARIOID);
			$bitacora = $bitacora_ctrl->obtener_eventos($documento->INVENTARIOID);

			return array($documentos, $bitacora);
		}

		function obtener_documento($id){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM ADM_DOCUMENTOS WHERE DOCUMENTOID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$documento = oci_fetch_object($stid);

			return $documento;
		}

		function obtener_documentos_vale($id){

			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "SELECT * FROM ADM_DOCUMENTOS WHERE VALEID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$documentos = array();

			while($data = oci_fetch_array($stid,OCI_ASSOC))
			{
				$documentos[] = $data;
			}

			return $documentos;
		}

		function editar_documento($request){

			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$documento_id = $request["DOCUMENTOID"];
			$inventario_id = $request["INVENTARIOID"];

			/* Conectar a la BD */
			$dbc = new Oracle();
			$conn = $dbc->connect();

			if ($request["NUEVO_DIRECTORIO"] == '') {
				
				/* Solamente edito la informacion del documento */

				$query = "UPDATE ADM_DOCUMENTOS SET NOMBRE = '$nombre', DESCRIPCION = '$descripcion' 
				WHERE DOCUMENTOID = $documento_id";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);


			}else{

				/* Trae un nuevo archivo, eliminar el anterior */

				$documento = $this->obtener_documento($documento_id);
				unlink($_SERVER['DOCUMENT_ROOT'] . "/administrativo/control_vehiculos/".$documento->ARCHIVO);

				$nombre_archivo = $request["NUEVO_NOMBRE_ARCHIVO"];
				$archivo = $request["NUEVO_DIRECTORIO"];
				$tipo_archivo = $request["NUEVO_TIPO_ARCHIVO"];

				$query = "UPDATE ADM_DOCUMENTOS SET NOMBRE = '$nombre', DESCRIPCION = '$descripcion', ARCHIVO = '$archivo', NOMBRE_ARCHIVO = '$nombre_archivo', TIPO_ARCHIVO = '$tipo_archivo' WHERE DOCUMENTOID = $documento_id";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);

			}

			/* Registrar en bitacora */

			/* Devolver documentos para actualizar tabla */
			$documentos = $this->obtener_documentos($inventario_id);

			return array($documentos, $request);
		}

		function registrar_documento_vale($request){

			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$directorio = $request["DIRECTORIO"];
			$vale_id = $request["VALEID"];
			$nombre_archivo = $request["NOMBRE_ARCHIVO"];
			$tipo_archivo = $request["TIPO_ARCHIVO"];

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			$query = "INSERT INTO ADM_DOCUMENTOS (NOMBRE, DESCRIPCION, ARCHIVO, NOMBRE_ARCHIVO, VALEID, TIPO_ARCHIVO) VALUES ('$nombre', '$descripcion', '$directorio', '$nombre_archivo',$vale_id, '$tipo_archivo')";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			$documentos = $this->obtener_documentos_vale($vale_id);

			return $documentos;
		}

		function eliminar_documento_vale($id){

			//Conectar a la base de datos
			$dbc = new Oracle();
			$conn = $dbc->connect();

			/* Obtener el documento y eliminar el archivo */

			$documento = $this->obtener_documento($id);
			unlink( $_SERVER['DOCUMENT_ROOT'] . "/administrativo/control_vehiculos/".$documento->ARCHIVO);

			/* Eliminar el registro en la base de datos */

			$query = "DELETE FROM ADM_DOCUMENTOS WHERE DOCUMENTOID = $id";

			$stid = oci_parse($conn, $query);
			oci_execute($stid);

			/* Obtener documentos para actualizar la tabla */
			$documentos = $this->obtener_documentos_vale($documento->VALEID);

			return array($documentos);
		}

		function editar_documento_vale($request){

			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$documento_id = $request["DOCUMENTOID"];
			$vale_id = $request["VALEID"];

			/* Conectar a la BD */
			$dbc = new Oracle();
			$conn = $dbc->connect();

			if ($request["NUEVO_DIRECTORIO"] == '') {
				
				/* Solamente edito la informacion del documento */

				$query = "UPDATE ADM_DOCUMENTOS SET NOMBRE = '$nombre', DESCRIPCION = '$descripcion' 
				WHERE DOCUMENTOID = $documento_id";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);


			}else{

				/* Trae un nuevo archivo, eliminar el anterior */

				$documento = $this->obtener_documento($documento_id);
				unlink($_SERVER['DOCUMENT_ROOT'] . "/administrativo/control_vehiculos/".$documento->ARCHIVO);

				$nombre_archivo = $request["NUEVO_NOMBRE_ARCHIVO"];
				$archivo = $request["NUEVO_DIRECTORIO"];
				$tipo_archivo = $request["NUEVO_TIPO_ARCHIVO"];

				$query = "UPDATE ADM_DOCUMENTOS SET NOMBRE = '$nombre', DESCRIPCION = '$descripcion', ARCHIVO = '$archivo', NOMBRE_ARCHIVO = '$nombre_archivo', TIPO_ARCHIVO = '$tipo_archivo' WHERE DOCUMENTOID = $documento_id";

				$stid = oci_parse($conn, $query);
				oci_execute($stid);

			}

			/* Registrar en bitacora */

			/* Devolver documentos para actualizar tabla */
			$documentos = $this->obtener_documentos_vale($vale_id);

			return array($documentos, $request);

		}

	}

?>
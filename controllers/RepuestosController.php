<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';
class RepuestosController{
    function __contruct(){
        
    }
    function obtener_listado($vehiculoid){
        $dbc = new Oracle();
		$conn = $dbc->connect();
        $sql = "select to_char(fecha,'DD/MM/YYYY'), gestionid from adm_solicitudes_repuestos where inventarioid = $vehiculoid";
        $stid = oci_parse($conn, $sql);
        oci_execute($stid);
        $listado = array();
		while($data = oci_fetch_array($stid,OCI_BOTH)){
		    $fecha = $data[0];
            $gestionid = $data[1];
            //Datos de la gestion de adm_gestiones
            $sql = "select titulo, to_char(fecha,'DD/MM/YYYY'), to_char(fechafinalizacion,'DD/MM/YYYY') from adm_gestiones where gestionid = ".$gestionid;
            
            $stid_consulta = oci_parse($conn, $sql);
            oci_execute($stid_consulta);
            $datos_gestion = oci_fetch_array($stid_consulta,OCI_BOTH);
            $titulo_gestion = $datos_gestion[0];
            $fecha_ingreso = $datos_gestion[1];
            @$fecha_finalizacion = $datos_gestion[2];
            //Obtener quien esta trabajando la gestion actualmente
            $sql = "select usuarioid,to_char(fechainicio,'DD/MM/YYYY'),to_char(fechafinal,'DD/MM/YYYY') from adm_workflow where gestionid = $gestionid order by fechainicio asc";
            $stid_consulta = oci_parse($conn,$sql);
            oci_execute($stid_consulta);
            $datos_gestion = oci_fetch_array($stid_consulta,OCI_BOTH);
            $usuario = $datos_gestion[0];
            $fecha_inicio = $datos_gestion[1];
            @$fecha_fin = $datos_gestion[2];
            $listado[] = array("FECHA"=>$fecha, "GESTIONID"=> $gestionid,"TITULO"=> $titulo_gestion, "USUARIO"=>$usuario,"FECHA_INICIO"=>$fecha_inicio, "FECHA_FIN"=>$fecha_fin);
		}
        return $listado;
    }
    
    function detalle_gestion($gestionid){
        $dbc = new Oracle();
		$conn = $dbc->connect();
        $sql = "select g.titulo, g.detalle, (select nombre||' '||apellido from rh_empleados where nit = g.empleadoid) as colaborador, (select descripcion from rh_areas where codarea = g.codarea) as area,decode(g.status,0,'INGRESADA',3,'RECHAZADA',4,'EN PROCESO',5,'FINALIZADA') AS estado from adm_gestiones g where g.gestionid = ".$gestionid;
        //echo $sql;
        $stid_consulta = oci_parse($conn,$sql);
        oci_execute($stid_consulta);
        $datos_gestion = oci_fetch_array($stid_consulta, OCI_BOTH);
        $titulo = $datos_gestion[0];
        @$detalle = $datos_gestion[1];
        $colaborador = $datos_gestion[2];
        $area = $datos_gestion[3];
        $estado = $datos_gestion[4];
        switch($estado){
            case "INGRESADA":
                $color = "#000000";
                break;
            case "RECHAZADA":
                $color = "#FF0000";
                break;
            case "FINALIZADA":
                $color = "#01DF01";
                break;
            case "EN PROCESO":
                $color = "#FF8000";
                break;
        }
        
        
        
        $resultado = array("TITULO" => $titulo, "DETALLE" => $detalle, "COLABORADOR" => $colaborador, "AREA" => $area, "ESTADO" => $estado, "COLOR" => $color);
        return $resultado;
    }
}
?>
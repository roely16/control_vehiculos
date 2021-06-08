<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/db/oracle.php';
class CorrectivasController{
    function __contruct(){
        
    }
    function obtener_listado($vehiculoid){
        $dbc = new Oracle();
		$conn = $dbc->connect();
        $sql = "select to_char(fecha,'DD/MM/YYYY'), gestionid, motivo, obtenerNombre(empleadoid),obtenerNombre(piloto),estado from adm_gestiones_correctivas where inventarioid = $vehiculoid";
        $stid = oci_parse($conn, $sql);
        oci_execute($stid);
        $listado = array();
		while($data = oci_fetch_array($stid,OCI_BOTH)){
            list($fecha,$gestionid, $motivo, $usuario, $piloto, $estado) = $data;
            if($estado == 0){
                $estado = "INGRESADA";
            }
            if($estado == 1){
                $estado = "EN PROCESO";
            }
            if($estado == 2){
                $estado = "FINALIZADA";
            }
            if($estado == 3){
                $estado = "RECHAZADA";
            }
            $listado[] = array("FECHA"=>$fecha, "GESTIONID"=> $gestionid,"MOTIVO"=> $motivo, "USUARIO"=>$usuario,"PILOTO"=>$piloto, "ESTADO"=>$estado);
		}
        return $listado;
    }
    
    function detalle_gestion($gestionid){
        $dbc = new Oracle();
		$conn = $dbc->connect();
        $sql = "select gestionid, inventarioid, placa, obtenerNombre(piloto), motivo, to_char(fecha, 'DD/MM/YYYY'), decode(estado,0,'INGRESADA',1,'EN PROCESO',2,'FINALIZADA',3,'RECHAZADA') AS estado, obtenerNombre(empleadoid) from adm_gestiones_correctivas where gestionid = ".$gestionid;
        //echo $sql;
        $stid_consulta = oci_parse($conn,$sql);
        oci_execute($stid_consulta);
        $datos_gestion = oci_fetch_array($stid_consulta, OCI_BOTH);
        list($gestionid, $inventarioid,$placa,$piloto, $motivo, $fecha, $estado, $empleadoid ) = $datos_gestion;
        $color = "";
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
        
        
        
        $resultado = array("GESTIONID" => $gestionid, "MOTIVO" => $motivo, "USUARIO" => $empleadoid, "PILOTO" => $piloto, "ESTADO" => $estado, "COLOR" => $color,"FECHA" => $fecha);
        return $resultado;
    }
    
    function actualizar_gestion($gestionid, $estado){
        $dbc = new Oracle();
		$conn = $dbc->connect();  
        $sql = "update adm_gestiones_correctivas set estado = ".(int)$estado." where gestionid = ".$gestionid;
        $stid_consulta = oci_parse($conn,$sql);
        oci_execute($stid_consulta);
        return array("MENSAJE"=>"Estado de la gestión actualizada");
    }
}
?>
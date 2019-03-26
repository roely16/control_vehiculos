<?php
    class Dbconfig {

        protected $user;
        protected $password;
        protected $dbname;

        function Dbconfig() {

            $this->user = 'rrhh';
            $this->password = 'rrhh2014';
            $this->dbName = '   (DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 172.23.50.95)(PORT = 1521)))(CONNECT_DATA = (SERVICE_NAME = CATGIS)))';

        }
    }
?>
<?php  

	class Mailconfig {

        protected $host;
        protected $charset;
        protected $smtp_auth;
        protected $username;
        protected $password;
        protected $from;
        protected $fromname;
        protected $wordwrap;

        function Mailconfig() {

            $this->host = 'mail2.muniguate.com';
            $this->charset = 'UTF-8';
            $this->smtp_auth = false;
            $this->username = "soportecatastro";
            $this->password = "catastro2015";
            $this->from = "no-reply@muniguate.com";
            $this->fromname = "noreply";
            $this->wordwrap = 50;

        }

    }

?>
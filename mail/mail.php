<?php  

	include $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/mail/mail_config.php';

	require $_SERVER['DOCUMENT_ROOT'] . '/administrativo/control_vehiculos/PHPMailer/PHPMailerAutoload.php';

	class Mail extends Mailconfig{

		protected $mail;

		function __construct(){

			$mail_config = new Mailconfig();

			$this->mail = new PHPMailer();
			$this->mail->CharSet = $mail_config->charset;
			$this->mail->isSMTP();
			$this->mail->Host = $mail_config->host;
			$this->mail->SMTPAuth = $mail_config->smtp_auth;
			$this->mail->Username = $mail_config->username;
			$this->mail->Password = $mail_config->password;
			$this->mail->From = $mail_config->from;
			$this->mail->FromName = $mail_config->fromname;
			$this->mail->WordWrap = $mail_config->wordwrap;
			$this->mail->addReplyTo($mail_config->from);
			$this->mail->isHTML(true);

		}
		
		function send_mail($email, $subject,$body){

			$this->mail->addAddress($email);
			$this->mail->Body = html_entity_decode($body);
			$this->mail->Subject = $subject;

			
			if(!$this->mail->send()) {

        		$error_message = 'Message could not be sent.<br>Mailer Error: ' . $this->mail->ErrorInfo;
        		return array('id_send_email' => 0, 'txt_mail' => $error_message);

		    } else {

		        $error_message = 'Message has been sent';
		        return array('id_send_email' => 1, 'txt_mail' => $error_message);

		    }

		}

	}

?>
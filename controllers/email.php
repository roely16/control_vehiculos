<?php
require '../PHPMailer/PHPMailerAutoload.php';

function send_email($email, $name, $subject, $body, $files) {
    
    $mail = new PHPMailer;
    
    $mail->CharSet = 'UTF-8';
    
    /* mail.muni */
    $mail->isSMTP();                                      // Set mailer to use SMTP
    //$mail->SMTPDebug  = 1; // debugging: 1 = errors and messages, 2 = messages only
    $mail->Host       = '172.23.50.25';                   // Specify main and backup SMTP servers
    $mail->SMTPAuth   = true;                             // Enable SMTP authentication
    $mail->Username   = 'soportecatastro';                // SMTP username
    $mail->Password   = 'catastro2015';                   // SMTP password
    //$mail->SMTPSecure = 'tls';                            // Enable encryption, 'ssl' also accepted
    //$mail->Port       = 587;
    /* /mail.muni*/

    $mail->From = 'soportecatastro@muniguate.com';
    $mail->FromName = 'ENCUESTA';
    $mail->addAddress($email, $name);
    
    //$mail->addAddress('mamartinez@muniguate.com', 'Marvin Martinez');     // Add a recipient
    //$mail->addAddress('');                                // Name is optional
    //$mail->addReplyTo('no-reply@muniguate.com');
    //$mail->addCC('cc@example.com');
    //$mail->addBCC('bcc@example.com');
    
    $mail->WordWrap = 50;                                 // Set word wrap to 50 characters
    //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
    
    if(count($files) > 0) {
        foreach($files as $file_name => $file_path) {
            $mail->addAttachment($file_path, $file_name);
        }
    }
    
    $mail->isHTML(true);                                  // Set email format to HTML
    
    $mail->Subject = $subject;
    $mail->Body    = html_entity_decode($body);
    //$mail->AltBody = '';
    
    if(!$mail->send()) {
        $error_message = 'Message could not be sent.<br>Mailer Error: ' . $mail->ErrorInfo;
        return array('id_send_email' => 0, 'txt_mail' => $error_message);
    } else {
        $error_message = 'Message has been sent';
        return array('id_send_email' => 1, 'txt_mail' => $error_message);
    }
}

function send_email_multiple($email, $email_cc, $name, $subject, $body, $files) {

    $mail = new PHPMailer;

    $mail->CharSet = 'UTF-8';

    /* mail.muni */
    $mail->isSMTP();                                      // Set mailer to use SMTP
    //$mail->SMTPDebug  = 1; // debugging: 1 = errors and messages, 2 = messages only
    $mail->Host       = '172.23.50.25';                   // Specify main and backup SMTP servers
    $mail->SMTPAuth   = true;                             // Enable SMTP authentication
    $mail->Username   = 'soportecatastro';                // SMTP username
    $mail->Password   = 'catastro2015';                   // SMTP password
    //$mail->SMTPSecure = 'tls';                            // Enable encryption, 'ssl' also accepted
    //$mail->Port       = 587;
    /* /mail.muni*/

    $mail->From = 'soportecatastro@muniguate.com';
    $mail->FromName = 'ENCUESTA';
    
    foreach($email as $destinatarios) {
        $mail->addAddress($destinatarios, '');
    }
    
    $mail->addCC($email_cc);

    //$mail->addAddress('mamartinez@muniguate.com', 'Marvin Martinez');     // Add a recipient
    //$mail->addAddress('');                                // Name is optional
    //$mail->addReplyTo('no-reply@muniguate.com');
    //$mail->addCC('cc@example.com');
    //$mail->addBCC('bcc@example.com');

    $mail->WordWrap = 50;                                 // Set word wrap to 50 characters
    //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

    if(count($files) > 0) {
        foreach($files as $file_name => $file_path) {
            $mail->addAttachment($file_path, $file_name);
        }
    }

    $mail->isHTML(true);                                  // Set email format to HTML

    $mail->Subject = $subject;
    $mail->Body    = html_entity_decode($body);
    //$mail->AltBody = '';

    if(!$mail->send()) {
        $error_message = 'Message could not be sent.<br>Mailer Error: ' . $mail->ErrorInfo;
        return array('id_send_email' => 0, 'txt_mail' => $error_message);
    } else {
        $error_message = 'Message has been sent';
        return array('id_send_email' => 1, 'txt_mail' => $error_message);
    }
}
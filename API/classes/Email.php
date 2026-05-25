<?php
namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email {
    private $correo;
    private $token;
    public function __construct($correo, $token)
    {
        $this->correo = $correo;
        $this->token = $token;
    }

    public function enviarActivacion() {
        //Crear el objeto de email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = 'bd065d464d3816';
        $mail->Password = 'e0128896f0e577';

        $mail->setFrom('administracion@us.com');
        $mail->addAddress($this->correo);
        $mail->Subject = 'Confirma tu cuenta';

        // Set HTML
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong> Hola " . $this->correo . "</strong>. Se ha creado tu cuenta de empleado en Unlimited Software, solo debes confirmarla presiondando el siguiente enlace</p>";
        $contenido .= "<p>Presiona aqui: < href= 'http:localhost:5173/confirmar-cuenta/" . $this->token . "' > Confirmar Cuenta </a> </p>";
        $contenido .= "<p>Si no eres empleado de Unlimited Software ignora este mensaje</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        // Enviar el mail
        $mail->send();
    }
}
package com.kiran.ProductCatalogApp.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {


    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    //RESET PASSWORD MAIL SENDER LOGIC
//    public void sendResetEmail(String toEmail, String token) {
//        String resetLink = "http://localhost:5173/reset-password/" + token;
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject("Reset Password");
//        message.setText("Click the link to reset your password:\n" +  resetLink);
//
//        mailSender.send(message);
//    }


    //SEND OTP TO USER VIA EMAIL
    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your Login Verification Code");
        message.setText("Your OTP for logging into the Product Catalog is: " + otp +
                "\nThis code will expire in 5 minutes.");

        System.out.println("Sending otp to: " + toEmail);
        mailSender.send(message);
    }
}

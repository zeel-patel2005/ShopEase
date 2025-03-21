package org.example.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String from, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(from); // Your contact email
        mailMessage.setSubject("New Contact Us Message");
        mailMessage.setText("From: " + from + "\n\nMessage:\n" + message);
        mailSender.send(mailMessage);
    }
}

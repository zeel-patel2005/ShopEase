package org.example.ecommerce.controller;

import org.example.ecommerce.model.ContactRequest;
import org.example.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/contact")
    public ResponseEntity<String> receiveMessage(@RequestBody ContactRequest request) {
        emailService.sendEmail(request.getEmail(), request.getMessage());
        return ResponseEntity.ok("Message sent successfully!");
    }
}

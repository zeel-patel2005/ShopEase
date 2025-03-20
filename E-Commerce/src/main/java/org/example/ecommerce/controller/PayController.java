package org.example.ecommerce.controller;

import org.example.ecommerce.service.PayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PayController {

    @Autowired
    private PayService payService;

    @PostMapping("/create-razorpay-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> requestData) {
        try {
            Map<String, Object> orderData = payService.createRazorpayOrder(requestData);
            return ResponseEntity.ok(orderData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<Map<String, String>> verifyPayment(@RequestBody Map<String, String> paymentData) {
        boolean isValid = payService.verifyPayment(paymentData);
        if (isValid) {
            return ResponseEntity.ok(Map.of("status", "success"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "failure", "message", "Payment verification failed"));
        }
    }
}
package org.example.ecommerce.controller;

import org.example.ecommerce.service.PayService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PayController {
    @Autowired
    private PayService payService;

    @PostMapping("/create-razorpay-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        try {
            String receiptId = UUID.randomUUID().toString();

            // Extract values from request map
            int amount = ((Number) request.get("amount")).intValue();
            String currency = request.get("currency") != null ?
                    (String) request.get("currency") : "INR";

            String orderJson = payService.createOrder(amount, currency, receiptId);

            // Create response map
            Map<String, Object> response = Map.of("orderData", orderJson);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            // Extract values from request map
            String razorpayOrderId = request.get("razorpayOrderId");
            String razorpayPaymentId = request.get("razorpayPaymentId");
            String razorpaySignature = request.get("razorpaySignature");

            boolean isValid = payService.verifyPaymentSignature(
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature
            );

            if (isValid) {
                // Here you would typically update your database with payment status
                return ResponseEntity.ok(Map.of("status", "success"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "status", "failed",
                                "message", "Invalid signature"
                        ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()
                    ));
        }
    }
}
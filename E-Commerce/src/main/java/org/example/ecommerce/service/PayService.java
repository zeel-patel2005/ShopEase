package org.example.ecommerce.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PayService {
    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    public String createOrder(int amount, String currency, String receiptId) throws RazorpayException {
        RazorpayClient razorpayClient;
        try {
            razorpayClient = new RazorpayClient(apiKey, apiSecret);
        } catch (RazorpayException e) {
            throw new RazorpayException("Failed to initialize Razorpay client: " + e.getMessage());
        }

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); // Amount in paise
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receiptId);

        // Add options for test mode
        JSONObject notes = new JSONObject();
        notes.put("is_test", "true");
        orderRequest.put("notes", notes);

        try {
            Order order = razorpayClient.orders.create(orderRequest);
            return order.toString();
        } catch (RazorpayException e) {
            throw new RazorpayException("Failed to create order: " + e.getMessage());
        }
    }

    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) throws RazorpayException {
        try {
            return Utils.verifyPaymentSignature(
                    new JSONObject()
                            .put("razorpay_order_id", orderId)
                            .put("razorpay_payment_id", paymentId)
                            .put("razorpay_signature", signature),
                    apiSecret
            );
        } catch (Exception e) {
            throw new RazorpayException("Failed to verify payment signature: " + e.getMessage());
        }
    }
}

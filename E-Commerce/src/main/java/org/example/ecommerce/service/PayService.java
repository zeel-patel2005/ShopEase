package org.example.ecommerce.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PayService {

    @Value("${razorpay.api.key}")
    private String keyId;

    @Value("${razorpay.api.secret}")
    private String keySecret;

    public Map<String, Object> createRazorpayOrder(Map<String, Object> requestData) throws Exception {
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        int amount = (int) requestData.get("amount");
        String currency = (String) requestData.get("currency");
        String receipt = (String) requestData.get("receipt");

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount);
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);

        Order order = razorpay.orders.create(orderRequest);
        Map<String, Object> orderData = new HashMap<>();
        orderData.put("id", order.get("id"));
        orderData.put("amount", order.get("amount"));
        orderData.put("currency", order.get("currency"));

        return orderData;
    }

    public boolean verifyPayment(Map<String, String> paymentData) {
        try {
            String orderId = paymentData.get("razorpayOrderId");
            String paymentId = paymentData.get("razorpayPaymentId");
            String signature = paymentData.get("razorpaySignature");

            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(options, keySecret);
        } catch (Exception e) {
            return false;
        }
    }
}
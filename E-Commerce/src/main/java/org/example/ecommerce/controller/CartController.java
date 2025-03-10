package org.example.ecommerce.controller;

import org.example.ecommerce.model.Cart;
import org.example.ecommerce.model.CartItem;
import org.example.ecommerce.repository.CartRepository;
import org.example.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(
            @RequestParam String userEmail,
            @RequestParam Long productId,
            @RequestParam int quantity) {

        String result = cartService.addToCart(userEmail, productId, quantity);
        return ResponseEntity.ok(result);
    }


    @GetMapping("/noofproduct/{email}")
    public ResponseEntity<Long> getUserCart(@PathVariable String email) {

        Long id = cartRepository.findCartIdByEmail(email);
        Long cartItems = cartService.getCartByUserId(id);
        return ResponseEntity.ok(cartItems);
    }

}

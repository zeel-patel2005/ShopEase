package org.example.ecommerce.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.example.ecommerce.repository.CartRepository;
import org.example.ecommerce.repository.ProductRepository;
import org.example.ecommerce.model.Cart;
import org.example.ecommerce.model.CartItem;
import org.example.ecommerce.model.Product;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public String addToCart(String userEmail, Long productId, int quantity) {
        Cart cart = cartRepository.findByUserId(userEmail).orElse(null);
        String result = "";

        if (cart == null) {
            cart = new Cart();
            cart.setUserId(userEmail);
            cart.setDate(LocalDate.now());
            cart.setProducts(new ArrayList<>());
        }

        if (cart.getProducts() == null) {
            cart.setProducts(new ArrayList<>());
        }

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return "Product not found";
        }

        synchronized (this) {
            boolean productExists = cart.getProducts()
                    .stream()
                    .anyMatch(item -> item.getProduct().getId().equals(productId));

            if (productExists) {
                result = "Item already in cart";
            } else {
                CartItem cartItem = new CartItem();
                cartItem.setProduct(product);
                cartItem.setQuantity(quantity);
                cart.getProducts().add(cartItem);
                cartRepository.save(cart);
                result = "Added to cart";
            }
        }

        return result;
    }

    public Long getCartByUserId(Long id) {
        return cartRepository.countProductsInCart(id);
    }

    public List<CartItem> getCartItemsByEmail(String email) {
        Long cartid = cartRepository.findCartIdByEmail(email);
        List<CartItem> cartItems = cartRepository.findByCartId(cartid);
        return cartItems;
    }
}

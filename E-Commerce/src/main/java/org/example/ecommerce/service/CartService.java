package org.example.ecommerce.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.example.ecommerce.repository.CartItemRepo;
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
    @Autowired
    private CartItemRepo cartItemRepo;


    public String addToCart(String userEmail, Long productId, int quantity) {
        Cart cart = cartRepository.findByUserId(userEmail).orElse(null);

        if (cart == null) {
            cart = new Cart();
            cart.setUserId(userEmail);
            cart.setDate(LocalDate.now());
            cart.setProducts(new ArrayList<>()); // Initialize product list
        }

        if (cart.getProducts() == null) {
            cart.setProducts(new ArrayList<>()); // Ensure product list is not null
        }

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return "Product not found";
        }

        // Check if product already exists in the cart
        Optional<CartItem> existingItem = cart.getProducts()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            return "Item already in cart"; // Return message instead of adding again
        }

        // If product is not in cart, add it
        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        cartItem.setCart(cart); // ✅ Set the cart reference
        cart.getProducts().add(cartItem);
        cartRepository.save(cart); // // Save updated cart
        return "Added to cart";
    }

    public Long getCartByUserId(Long id) {
        return cartRepository.countProductsInCart(id);
    }

    public List<CartItem> getCartItemsByEmail(String email) {
        Long cartid = cartRepository.findCartIdByEmail(email);
        List<CartItem> cartItems = cartRepository.findByCartId(cartid);
        return cartItems;
    }

    public String clearCart(String userEmail) {
        Optional<Cart> cartOptional = cartRepository.findByUserId(userEmail);

        if (cartOptional.isPresent()) {
            Cart cart = cartOptional.get();

            // Delete all cart items from the database
            cartItemRepo.deleteAll(cart.getProducts());

            // Clear cart products list
            cart.getProducts().clear();

            // Save the empty cart
            cartRepository.save(cart);

            return "Cart cleared successfully";
        }

        return "Cart not found";
    }

}

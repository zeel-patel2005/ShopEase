package org.example.ecommerce.service;

import org.example.ecommerce.model.CartItem;
import org.example.ecommerce.model.Product;
import org.example.ecommerce.repository.CartItemRepo;
import org.example.ecommerce.repository.CartRepository;
import org.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepo cartItemRepo;

    public List<Product> getallproduct() {
        List<Product> products = productRepository.findAll();
        return products;
    }

    public Product getProductById(Long id) {
        Product product = productRepository.findById(id).get();
        return product;
    }

    public List<Product> getProductsByCategory(String category) {
        List<Product> products = productRepository.findByCategory(category);
        return products;
    }

    public String addproductplus(String email, Long productId) {
        Long cartId = cartRepository.findCartIdByEmail(email);

        if (cartId == null) {
            return "Cart not found for this email.";
        }

        Optional<CartItem> cartItemOptional = cartItemRepo.findByCartIdAndProductId(cartId, productId);

        if (cartItemOptional.isPresent()) {
            CartItem cartItem = cartItemOptional.get();
            cartItem.setQuantity(cartItem.getQuantity() + 1); // Increase quantity
            cartItemRepo.save(cartItem);
            return "Product quantity increased successfully.";
        } else {
            return "Product not found in cart.";
        }
    }

    public String removeproductminus(String email, Long productId) {
        Long cartId = cartRepository.findCartIdByEmail(email);
        Optional<CartItem> cartItemOptional = cartItemRepo.findByCartIdAndProductId(cartId, productId);

        if (cartItemOptional.isPresent()) {
            CartItem cartItem = cartItemOptional.get();
            if (cartItem.getQuantity() == 1) {
                cartItemRepo.delete(cartItem); // Remove item from cart
                return "Item removed from cart";
            } else {
                cartItem.setQuantity(cartItem.getQuantity() - 1);
                cartItemRepo.save(cartItem);
                return "Item quantity decreased";
            }
        }
        return "Item not found in cart";
    }
}

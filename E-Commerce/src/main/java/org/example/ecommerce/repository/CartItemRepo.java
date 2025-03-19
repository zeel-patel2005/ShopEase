package org.example.ecommerce.repository;

import org.example.ecommerce.model.CartItem;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CartItemRepo extends CrudRepository<CartItem, Integer> {
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
}

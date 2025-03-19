package org.example.ecommerce.repository;

import org.example.ecommerce.model.Cart;
import org.example.ecommerce.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(String userId);

    @Query("SELECT c.id FROM Cart c WHERE c.userId = :email")
    Long findCartIdByEmail(@Param("email") String email);

    @Query("SELECT COUNT(ci) FROM Cart cart JOIN cart.products ci WHERE cart.id = :cartId")
    Long countProductsInCart(@Param("cartId") Long cartId);

    @Query("SELECT c FROM CartItem c WHERE c.cart.id = :cartId")
    List<CartItem> findByCartId(@Param("cartId") Long cartId);

}

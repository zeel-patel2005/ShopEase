package org.example.ecommerce.service;

import org.example.ecommerce.model.Product;
import org.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

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
}

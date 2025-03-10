package org.example.ecommerce.controller;

import org.example.ecommerce.model.Product;
import org.example.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/getallproduct")
    public List<Product> getAllProduct(){
        return productService.getallproduct();
    }

    @GetMapping("/getproductbyid/{id}")
    public Product getProductById(@PathVariable Long id){
        return productService.getProductById(id);
    }

    @GetMapping("/getproductbycategory/{category}")
    public List<Product> getProductByCategory(@PathVariable String category){
        return productService.getProductsByCategory(category);
    }

}

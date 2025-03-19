package org.example.ecommerce.controller;

import org.example.ecommerce.model.Product;
import org.example.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping("/plus")
    public ResponseEntity<String> addProduct(@RequestBody Map<String, Object> requestData) {
        String email = (String) requestData.get("email");
        Long productId = Long.valueOf(requestData.get("productId").toString());

        if (email == null || productId == null) {
            return ResponseEntity.badRequest().body("Invalid email or productId");
        }

        String result = productService.addproductplus(email, productId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/remove")
    public ResponseEntity<String> removeProduct(@RequestBody Map<String, Object> requestData) {
        String email = (String) requestData.get("email");
        Long productId = Long.valueOf(requestData.get("productId").toString());
        if (email == null || productId == null) {
            return ResponseEntity.badRequest().body("Invalid email or productId");
        }
        String result = productService.removeproductminus(email,productId);
        return ResponseEntity.ok(result);
    }

}

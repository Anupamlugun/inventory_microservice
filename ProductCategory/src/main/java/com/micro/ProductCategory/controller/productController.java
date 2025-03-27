package com.micro.ProductCategory.controller;

import java.util.List;
import com.micro.ProductCategory.service.productsServiceImpli;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.micro.ProductCategory.model.Product;
import com.micro.ProductCategory.repository.productsRepository;

@RestController
public class productController {

    @Autowired
    private productsServiceImpli productService;

    @Autowired
    private productsRepository productsRepository;

    @GetMapping("/getproducts")
    public Page<Product> getProducts(@RequestParam int page, @RequestParam int size) {
        return productService.retrivePoducts(page, size);
    }

    // get category details by product id
    @GetMapping("/getproductdetailsbyproid/{productId}")
    public Product getProductDetailsByProId(@PathVariable Long productId) {
        return productsRepository.findCatDtlByProId(productId);
    }

    @GetMapping("/getproducts/{category_id}/{purchase_sale}")
    public List<Product> getProductsWithCate(@PathVariable Long category_id, @PathVariable String purchase_sale) {
        return productService.retrivePoductsWithCat(category_id, purchase_sale);
    }

    @PostMapping("/saveproduct")
    public String saveProducts(@RequestBody Product product) {

        return productService.saveProduct(product);

    }

    @PutMapping("/deleteproduct/{product_id}")
    public String deleteProduct(@PathVariable Long product_id) {
        return productService.deletePro(product_id);
    }

    @GetMapping("/getproductbyid")
    public Product getProById(@RequestParam Long product_id) {
        return productService.getProudctsById(product_id);
    }

    @PutMapping("/updateproducts/{product_id}")
    public String updateProduct(@PathVariable Long product_id, @RequestBody Product product) {
        return productService.updatePro(product_id, product);
    }

    @GetMapping("/gettotalproducts")
    public String getTotalProducts() {
        return productService.getProCount();
    }
}

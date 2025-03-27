package com.micro.ProductCategory.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.micro.ProductCategory.model.Product;

public interface productService {

    String saveProduct(Product product);

    Page<Product> retrivePoducts(int page, int size);

    String deletePro(Long product_id);

    String updatePro(Long product_id, Product product);

    List<Product> retrivePoductsWithCat(Long category_id, String purchase_sale);

    Product getProudctsById(Long product_id);

    String getProCount();
}

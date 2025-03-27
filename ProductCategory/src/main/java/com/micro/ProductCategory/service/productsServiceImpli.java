package com.micro.ProductCategory.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.micro.ProductCategory.entity.CategoryEntity;
import com.micro.ProductCategory.entity.productsEntity;
import com.micro.ProductCategory.model.Product;
import com.micro.ProductCategory.model.Stock;
import com.micro.ProductCategory.repository.CategoryRepository;
import com.micro.ProductCategory.repository.productsRepository;

@Service
public class productsServiceImpli implements productService {
    @Autowired
    private productsRepository productsRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private final RestTemplate restTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    productsServiceImpli(RestTemplate restTemplate, SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        this.restTemplate = restTemplate;
    }

    @Override
    public String saveProduct(Product product) {
        // Convert product to productsEntity
        productsEntity productsEntity = new productsEntity();
        BeanUtils.copyProperties(product, productsEntity);

        // Find the category by ID, safely extract the value from Optional
        Optional<CategoryEntity> optionalCategory = categoryRepository.findById(product.getCategory_id());
        if (!optionalCategory.isPresent()) {
            return "Category not found"; // Early return if category doesn't exist
        }

        // Get all products and check for duplicates based on category and product name
        List<productsEntity> productsEntities = productsRepository.findAll();
        for (productsEntity existingProduct : productsEntities) {
            if (existingProduct.getCategory() != null &&
                    product.getCategory_id().equals(existingProduct.getCategory().getCategory_id()) &&
                    product.getProduct_name().equals(existingProduct.getProduct_name())) {
                return "Products already exist"; // Early return if duplicate is found
            }
        }

        // Set the category and save the product if no duplicates are found
        productsEntity.setCategory(optionalCategory.get());
        productsRepository.save(productsEntity);
        getProCount(); // Update the total product count
        return "Product saved successfully"; // Return success message
    }

    @Override
    public Page<Product> retrivePoducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        Page<productsEntity> productsPage = productsRepository.findByStatusTrue(pageable);

        return productsPage.map(productsEntity -> {
            Product pro = new Product();
            BeanUtils.copyProperties(productsEntity, pro);

            if (productsEntity.getCategory() != null) {
                pro.setCategory_id(productsEntity.getCategory().getCategory_id());
                pro.setCategory_name(productsEntity.getCategory().getCategory_name());
            }

            return pro;
        });
    }

    @Override
    public List<Product> retrivePoductsWithCat(Long category_id, String purchase_sale) {

        List<productsEntity> productsList = productsRepository.findByStatusTrue();
        List<Product> products = new ArrayList<>();

        for (productsEntity productsentity : productsList) {
            if (category_id.equals(productsentity.getCategory().getCategory_id())) {
                Product pro = new Product();

                // for stock availability
                // Optional<StockEntity> sOptional = stockRepository
                // .findByProductIdStockAvailable(productsentity.getProduct_id());
                // StockEntity stockEntity = sOptional.orElse(null);

                Stock stockavailablity = restTemplate.getForObject(
                        "http://SUPPLIERSTOCK/getstockavailablity/" + productsentity.getProduct_id(),
                        Stock.class);

                if (stockavailablity != null) {
                    pro.setAvailable(stockavailablity.getAvailable());
                } else {
                    pro.setAvailable(0L);
                }

                pro.setCategory_id(productsentity.getCategory().getCategory_id());
                pro.setCategory_name(productsentity.getCategory().getCategory_name());
                BeanUtils.copyProperties(productsentity, pro);

                // Debugging output
                System.out.println("Product ID: " + productsentity.getProduct_id() +
                        " Available: " + pro.getAvailable() +
                        " Purchase/Sale: " + purchase_sale);

                // Fixed condition
                if (pro.getAvailable() != null && pro.getAvailable() > 0 &&
                        "sale".equals(purchase_sale)) {

                    products.add(pro);
                    System.out.println(purchase_sale + " this is sale");
                } else if ("purchase".equals(purchase_sale)) {
                    products.add(pro);
                    System.out.println(purchase_sale + " this is purchase");
                }
            }
        }

        return products;

    }

    @Override
    public String deletePro(Long product_id) {
        if (!productsRepository.existsById(product_id)) {

            return "Product not found";
        }

        productsRepository.updateProductStatus(product_id, false);

        return "Products delete";
    }

    @Override
    public String updatePro(Long product_id, Product product) {

        // Get all products and check for duplicates based on category and product name
        List<productsEntity> productsEntities = productsRepository.findAll();
        for (productsEntity existingProduct : productsEntities) {
            if (existingProduct.getCategory() != null &&
                    product.getCategory_id().equals(existingProduct.getCategory().getCategory_id()) &&
                    product.getProduct_name().equals(existingProduct.getProduct_name())) {
                return "Products already exist"; // Early return if duplicate is found
            }
        }

        // esle update if product of same category and name not found

        if (productsRepository.existsById(product_id)) {
            productsEntity productsEntity = new productsEntity();
            BeanUtils.copyProperties(product, productsEntity);
            productsEntity.setProduct_id(product_id);

            Optional<CategoryEntity> category = categoryRepository.findById(product.getCategory_id());

            productsEntity.setCategory(category.get());
            productsRepository.save(productsEntity);
            return "Product updated successfully";
        }
        return "Product not found";
    }

    @Override
    public Product getProudctsById(Long product_id) {
        // Use the repository to find the product by its ID
        Optional<productsEntity> product = productsRepository.findById(product_id);

        if (product.isPresent()) {
            productsEntity productsEntity = product.get();

            Product product2 = new Product();

            product2.setCategory_id(productsEntity.getCategory().getCategory_id());
            product2.setCategory_name(productsEntity.getProduct_name());

            BeanUtils.copyProperties(productsEntity, product2);

            return product2;

        }
        return null;

    }

    @Override
    public String getProCount() {

        Long count = productsRepository.count();

        messagingTemplate.convertAndSend("/topic/totalProducts", count);
        return "Total products are " + count;
    }
}

package com.kiran.ProductCatalogApp.service;

import com.kiran.ProductCatalogApp.entity.Product;
import com.kiran.ProductCatalogApp.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
       return productRepository.findAll();
    }

    public List<Product> getProductByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setImgUrl(product.getImgUrl());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        System.out.println("Deleting product with ID: " + id);
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if(existingProduct.getCategory() != null) {
            existingProduct.getCategory().getProducts().remove(existingProduct);
        }
        productRepository.delete(existingProduct);
        System.out.println("Deleted Successfully");
    }
}

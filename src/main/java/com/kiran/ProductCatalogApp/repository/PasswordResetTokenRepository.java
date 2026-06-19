package com.kiran.ProductCatalogApp.repository;

import com.kiran.ProductCatalogApp.entity.PasswordResetToken;
import com.kiran.ProductCatalogApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);

    void deleteByUser(User existingUser);
}

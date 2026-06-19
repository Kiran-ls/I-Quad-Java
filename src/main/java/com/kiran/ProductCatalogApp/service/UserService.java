package com.kiran.ProductCatalogApp.service;

import com.kiran.ProductCatalogApp.entity.PasswordResetToken;
import com.kiran.ProductCatalogApp.entity.User;
import com.kiran.ProductCatalogApp.repository.PasswordResetTokenRepository;
import com.kiran.ProductCatalogApp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    public String registerUser(User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null) {
            return "User already exists";
        }
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return "Registered Successfully";
    }

    public User login(User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null &&
                passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            System.out.println("password matched");
            return existingUser;
        }
        return null;
    }

    @Transactional
    public String forgotPassword(String email) {
        User existingUser = userRepository.findByEmail(email);

        if (existingUser == null) {
            return "If user exists, reset link sent";
        }
        passwordResetTokenRepository.deleteByUser(existingUser);
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(existingUser);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));

        passwordResetTokenRepository.save(resetToken);

        emailService.sendResetEmail(existingUser.getEmail(), token);
        return "Reset link generated";
    }

    public String resetPassword(String token, String newPassword) {
        PasswordResetToken verifiedToken = passwordResetTokenRepository.findByToken(token);

        if(verifiedToken == null) {
            return "Invalid token";
        }
        if (verifiedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return "Token expired";
        }

        User user = verifiedToken.getUser();
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);

        userRepository.save(user);
        System.out.println("Password updated");
        passwordResetTokenRepository.delete(verifiedToken);
        return "Password updated successfully";
    }
}

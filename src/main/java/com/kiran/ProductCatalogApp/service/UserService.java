package com.kiran.ProductCatalogApp.service;

import com.kiran.ProductCatalogApp.entity.PasswordResetToken;
import com.kiran.ProductCatalogApp.entity.Role;
import com.kiran.ProductCatalogApp.entity.User;
import com.kiran.ProductCatalogApp.repository.PasswordResetTokenRepository;
import com.kiran.ProductCatalogApp.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    //private final PasswordEncoder passwordEncoder;
   // private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    /*
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

     */

    /* NORMAL LOGIN AND REGISTER

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
     */

    //OTP BASED LOGIN

    public String sendOtp(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(email.split("@")[0]);
        }
        
        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);
        emailService.sendOtpEmail(email, otp);

        return "OTP sent successfully";
    }

    public User verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email);

        if (user != null && user.getOtp() != null && user.getOtp().equals(otp)) {
            if (user.getOtpExpiry().isAfter(LocalDateTime.now())) {
                user.setOtp(null);
                user.setOtpExpiry(null);
                userRepository.save(user);
                return user;
            }
        }
        return null;
    }

    public List<User> getAllUsersForAdmin(HttpSession session) {
        String role = (String) session.getAttribute("userRole");

        //check if a current user has administrative permissions
        if (!"ROLE_MODERATOR".equals(role) && !"ROLE_ADMIN".equals(role)) {
            throw new SecurityException("Unauthorized: Access denied.");
        }
        return userRepository.findAll();
    }

    public void updateUserRoleByModerator(Long id, String newRoleStr, HttpSession session) {
        String sessionRole = (String) session.getAttribute("userRole");

        //enforce only a Moderator can exchange a role assignment swap
        if (!"ROLE_MODERATOR".equals(sessionRole)) {
            throw new SecurityException("Forbidden: Only Moderator can assign roles.");
        }
        //try to find user in the DB, or throw an error if the ID is wrong
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        //convert the incoming string to our role Enum type and save
        user.setRole(Role.valueOf(newRoleStr));
        userRepository.save(user);
    }
}

package com.kiran.ProductCatalogApp.controller;

import com.kiran.ProductCatalogApp.entity.User;
import com.kiran.ProductCatalogApp.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /*
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        System.out.println("Register API HIT");
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user, HttpSession session) {
        System.out.println("Register API HIT");
        User loggedUser = userService.login(user);

        if(loggedUser != null) {
            session.setAttribute("userId" , loggedUser.getId());
            session.setAttribute("userName", loggedUser.getUsername());
            return "success";
        }
        return "fail";
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        return userService.forgotPassword(email);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token,
                                @RequestParam String newPassword) {
        return userService.resetPassword(token, newPassword);
    }
     */

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String response = userService.sendOtp(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request, HttpSession session) {
        String email = request.get("email");
        String otp = request.get("otp");

        User loggedUser = userService.verifyOtp(email, otp);

        if (loggedUser != null){
            session.setAttribute("userId", loggedUser.getId());
            session.setAttribute("userName", loggedUser.getUsername());
            session.setAttribute("Role", loggedUser.getRole().name());
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "role", loggedUser.getRole().name()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("status", "fail"));
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "logout";
    }
}

package com.kiran.ProductCatalogApp.controller;

import com.kiran.ProductCatalogApp.entity.User;
import com.kiran.ProductCatalogApp.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user, HttpSession session) {
        User loggedUser = userService.login(user);

        if(loggedUser != null) {
            session.setAttribute("userId" , loggedUser.getId());
            session.setAttribute("userName", loggedUser.getUsername());
            return "success";
        }
        return "fail";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "logout";
    }
}

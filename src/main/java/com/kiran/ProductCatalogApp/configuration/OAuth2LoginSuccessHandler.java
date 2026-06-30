package com.kiran.ProductCatalogApp.configuration;


import com.kiran.ProductCatalogApp.entity.User;
import com.kiran.ProductCatalogApp.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public OAuth2LoginSuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        //get the authenticated google user info
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        User user = userRepository.findByEmail(email);

        String role = "ROLE_USER"; //default role
        if (user != null && user.getRole() != null) {
            role = user.getRole().name();
        }

        //save the role and tracking data into the backend HTTP session
        HttpSession session = request.getSession();
        if (user != null) {
            session.setAttribute("userId", user.getId());
            session.setAttribute("userName", user.getUsername());
        }
        session.setAttribute("userRole", role);

        //dynamically inject the role directly into your react client redirect URL param string
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/")
                .queryParam("login", "success")
                .queryParam("role", role)
                .build().toUriString();

        //send the browser flying back to react app
        getRedirectStrategy().sendRedirect(request, response, targetUrl);

    }
}

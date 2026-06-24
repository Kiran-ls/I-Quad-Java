package com.kiran.ProductCatalogApp.service;

import com.kiran.ProductCatalogApp.entity.User;
import com.kiran.ProductCatalogApp.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User userOptional = userRepository.findByEmail(email);

        if (userOptional == null) {
            User user = new User();
            user.setEmail(email);
            user.setUsername(name);

            userRepository.save(user);
            System.out.println("Saved new google user to DB: " + email);
        } else {
            System.out.println("Existing google user logged in: " + email);
        }
        return oAuth2User;
    }
}

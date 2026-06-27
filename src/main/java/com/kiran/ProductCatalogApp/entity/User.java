package com.kiran.ProductCatalogApp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(nullable = true)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    private String otp;
    private LocalDateTime otpExpiry;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER;
}

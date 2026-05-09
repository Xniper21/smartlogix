package com.smartlogix.bff.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String empresa;
    private String rol;
}
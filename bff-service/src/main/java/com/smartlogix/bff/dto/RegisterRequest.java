package com.smartlogix.bff.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String empresa;
}
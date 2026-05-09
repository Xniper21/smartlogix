package com.smartlogix.bff.dto;

import lombok.Data;

@Data
public class AuthDTO {
    private String token;
    private String email;
    private String empresa;
    private String rol;
}
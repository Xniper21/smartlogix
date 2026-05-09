package com.smartlogix.bff.service;

import com.smartlogix.bff.dto.*;
import com.smartlogix.bff.model.Usuario;
import com.smartlogix.bff.repository.UsuarioRepository;
import com.smartlogix.bff.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getEmpresa(), usuario.getRol());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(usuario.getEmail());
        response.setEmpresa(usuario.getEmpresa());
        response.setRol(usuario.getRol());

        return response;
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email ya registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setEmpresa(request.getEmpresa());
        usuario.setRol("ADMIN");

        usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getEmpresa(), usuario.getRol());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(usuario.getEmail());
        response.setEmpresa(usuario.getEmpresa());
        response.setRol(usuario.getRol());

        return response;
    }
}
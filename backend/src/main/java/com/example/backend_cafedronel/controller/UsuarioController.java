package com.example.backend_cafedronel.controller;

import com.example.backend_cafedronel.model.Usuario;
import com.example.backend_cafedronel.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")

public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        Map<String, Object> response = new HashMap<>();

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario != null && usuario.getPassword().equals(password) && Boolean.TRUE.equals(usuario.getActivo())) {
            response.put("success", true);
            response.put("user_id", usuario.getId());
            response.put("user_name", usuario.getNombre());
            response.put("email", usuario.getEmail());
            response.put("role", usuario.getRol());
        } else {
            response.put("success", false);
            response.put("message", "Credenciales incorrectas o usuario inactivo.");
        }
        return response;
    }

    @PostMapping("/registrar")
    public Map<String, Object> registrarUsuario(@RequestBody Usuario nuevoUsuario) {
        Map<String, Object> response = new HashMap<>();

        if (usuarioRepository.findByEmail(nuevoUsuario.getEmail()) != null) {
            response.put("success", false);
            response.put("message", "El email ya está registrado.");
            return response;
        }

        nuevoUsuario.setActivo(true);
        nuevoUsuario.setFechaRegistro(java.time.LocalDateTime.now());
        usuarioRepository.save(nuevoUsuario);

        response.put("success", true);
        response.put("message", "Usuario registrado exitosamente.");
        return response;
    }

    @GetMapping("/listar")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}

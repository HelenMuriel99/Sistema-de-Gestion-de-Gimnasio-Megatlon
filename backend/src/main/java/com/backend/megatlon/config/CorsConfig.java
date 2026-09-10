package com.backend.megatlon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Permite cualquier origen (Frontend, Postman, App Móvil, etc.)
        config.setAllowedOriginPatterns(List.of("*"));

        // Permite cualquier encabezado HTTP (Authorization, Content-Type, etc.)
        config.setAllowedHeaders(List.of("*"));

        // Permite los métodos HTTP estándar
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Permite credenciales (Cookies / Auth Headers)
        config.setAllowCredentials(true);

        // Expone encabezados específicos si el frontend los requiere
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
package com.backend.megatlon.config;

/*import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
/*
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Deshabilitar CSRF para permitir peticiones POST desde Postman/Thunder Client
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Permitir el paso público a todas las rutas bajo /api/v1/auth/
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    } */
    /*
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Permitir endpoints públicos de autenticación y setup
                        .requestMatchers("/api/v1/auth/**", "/api/auth/**").permitAll()

                        // Proteger endpoints administrativos
                        .requestMatchers("/api/v1/admin/**", "/api/admin/**").hasRole("PROPIETARIO")

                        .anyRequest().authenticated()
                );

        return http.build();
    } */

    /*@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Deshabilitar CSRF para peticiones REST / Postman
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Establecer gestión de sesión como STATELESS (para APIs REST)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 3. Definir reglas de autorización para los endpoints
                .authorizeHttpRequests(auth -> auth
                        // Endpoint público para setup y login
                        .requestMatchers("/api/v1/auth/**", "/api/auth/**").permitAll()

                        // Endpoints administrativos protegidos por autoridad exacta
                        .requestMatchers("/api/v1/admin/**", "/api/admin/**").hasAuthority("PROPIETARIO")

                        // Cualquier otra ruta requiere autenticación
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}*/
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desactiva CSRF para permitir pruebas desde Postman/REST Clients
                .csrf(AbstractHttpConfigurer::disable)
                // Permite el acceso público a todos los endpoints bajo /api/v1/**
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
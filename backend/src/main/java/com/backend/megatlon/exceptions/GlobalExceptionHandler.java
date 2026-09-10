package com.backend.megatlon.exceptions;

import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Manejador global de excepciones.
 * Antes de esto, cualquier excepción no controlada (ej. IllegalArgumentException
 * lanzada por las validaciones de negocio en los services) terminaba como un
 * 500 genérico sin "message" en el body, y el frontend no podía distinguir
 * entre "teléfono duplicado", "CI duplicado", "sin permisos", etc.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Errores de validación de negocio (CI duplicado, teléfono duplicado,
    // rol inválido, sucursal inactiva, etc.). Se devuelven como 409 Conflict
    // para que el frontend los distinga de un simple 400 de validación de formato.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(buildBody(HttpStatus.CONFLICT, ex.getMessage()));
    }

    // El usuario está autenticado pero no tiene el rol requerido
    // (ej. @PreAuthorize("hasRole('PROPIETARIO')") en PropietarioController).
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(buildBody(HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta acción."));
    }

    // Token ausente, mal formado o expirado en un endpoint protegido.
    @ExceptionHandler({ JwtException.class, AuthenticationException.class })
    public ResponseEntity<Object> handleAuthenticationException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(buildBody(HttpStatus.UNAUTHORIZED, "Tu sesión expiró o no es válida. Vuelve a iniciar sesión."));
    }

    // Red de seguridad: cualquier otra excepción no prevista.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildBody(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error inesperado en el servidor."));
    }

    private Map<String, Object> buildBody(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return body;
    }
}

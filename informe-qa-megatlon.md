# Informe QA — Sistema de Gestión de Gimnasio Megatlon

## 1. Errores

### 1 `JwtAuthenticationFilter` no captura errores de parseo del token
```java
jwt = authHeader.substring(7);
userCi = jwtService.extractUsername(jwt);
```
Si el token está expirado, mal formado o firmado incorrectamente, `jwtService.extractUsername()` lanza excepciones de la librería `jjwt` (`ExpiredJwtException`, `MalformedJwtException`, `SignatureException`) que **no se capturan**. El filtro no tiene try/catch, así que la petición termina en un 500 en lugar de un 401 "no autenticado". Cualquier cliente que mande un `Authorization: Bearer <token viejo o corrupto>` provoca un error de servidor.

### 2 Un token JWT sigue siendo válido aunque el usuario sea desactivado o bloqueado
`UserDetailsServiceImpl` construye el `UserDetails` así:
```java
return new User(usuario.getCi(), usuario.getPassword(),
        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + ...)));
```
Este constructor de 3 argumentos deja `enabled`, `accountNonLocked`, etc. siempre en `true`. El chequeo de `EstadoAcceso` (ACTIVO/BLOQUEADO/INACTIVO) **solo se hace en `AuthService.login()`, una vez, al momento de autenticar**. Después de eso, el JWT es autocontenido y stateless: si el `PropietarioEliminacionService` desactiva a un usuario (soft delete) mientras ese usuario tiene un token vigente, **el token sigue funcionando hasta que expira** (hasta 24h según `application-dev.yaml`). Esto rompe la garantía que el propio soft-delete pretende dar.
**Recomendación:** validar `estadoAcceso` en cada request autenticado (por ejemplo dentro del filtro, o mapeando `isEnabled()`/`isAccountNonLocked()` en `UserDetailsServiceImpl` según el estado real).

### 3 No hay endpoint para reactivar un usuario
Existe `DELETE /usuarios/{ci}` (soft delete → `INACTIVO`), pero ningún endpoint para volver a poner a alguien en `ACTIVO`. Una vez desactivado, un empleado queda inaccesible permanentemente salvo manipulación directa de base de datos.

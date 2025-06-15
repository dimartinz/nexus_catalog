import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly usersService: UsersService,) {
    super({
      // 1. Extracción del Token:
      // Especifica cómo se extraerá el JWT de la solicitud entrante.
      // Aquí, se espera que el token esté en el encabezado 'Authorization' como un 'Bearer' token.
      // Ejemplo: Authorization: Bearer <tu_jwt_aqui>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Manejo de Expiración:
      // Si es 'false', la estrategia fallará si el token ha expirado.
      ignoreExpiration: false,

      // 3. Proveedor de Clave Secreta o Pública (para verificar la firma del JWT):
      // Utiliza 'jwks-rsa' para obtener la clave pública de Auth0.
      // Auth0 utiliza claves RS256 (asimétricas), por lo que se necesita la clave pública para verificar la firma del JWT.
      secretOrKeyProvider: passportJwtSecret({
        cache: true, // Habilita el caché para las claves JWKS (JSON Web Key Set)
        rateLimit: true, // Habilita el límite de tasa para las solicitudes JWKS
        jwksRequestsPerMinute: 5, // Número de solicitudes JWKS permitidas por minuto
        // URL del endpoint JWKS de tu tenant de Auth0.
        // Este endpoint contiene las claves públicas utilizadas para firmar los tokens.
        jwksUri: `${configService.get('AUTH0_ISSUER_URL')}.well-known/jwks.json`,
      }),

      // 4. Emisor (Issuer) Esperado:
      // El valor 'iss' (issuer) en el payload del JWT debe coincidir con esta URL.
      // Es la URL de tu tenant de Auth0.
      issuer: configService.get('AUTH0_ISSUER_URL'),

      // 5. Audiencia (Audience) Esperada:
      // El valor 'aud' (audience) en el payload del JWT debe coincidir con este identificador.
      // Es el identificador de tu API que configuraste en Auth0.
      audience: configService.get('AUTH0_AUDIENCE'),

      // 6. Algoritmos de Firma Esperados:
      // Especifica los algoritmos de firma que se aceptarán. Auth0 usa RS256 por defecto para las APIs.
      algorithms: ['RS256'],
    });
  }

  // 7. Método de Validación del Payload:
  // Este método se llama después de que el token JWT ha sido verificado exitosamente
  // (es decir, la firma es válida, no ha expirado, y el emisor y la audiencia coinciden).
  // El 'payload' es el contenido decodificado del JWT.
  async validate(payload: any) {
    // Busca o crea un usuario en tu base de datos local basado en la información del payload de Auth0.
    // Esto es crucial para mapear el usuario de Auth0 a un usuario en tu aplicación.
    // El servicio 'usersService.findOrCreateFromAuth0' se encarga de esta lógica.
    const user = await this.usersService.findOrCreateFromAuth0(payload);

    // Lo que se retorna aquí será adjuntado al objeto 'request' de NestJS (por ejemplo, 'req.user').
    // De esta manera, tus controladores y otros guardias pueden acceder a la información del usuario autenticado.
    return user;
  }
}

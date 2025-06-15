import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos para la ruta desde el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si no se especifican roles, se permite el acceso
    }

    const { user } = context.switchToHttp().getRequest();

    // Obtener los roles del usuario
    const userRoles = user.roles || [];

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
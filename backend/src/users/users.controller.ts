import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthzGuard } from '../auth/guards/authz.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// Este controlador es solo un ejemplo para listar usuarios
// y está protegido para que solo los administradores puedan acceder.
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(AuthzGuard, RolesGuard)
    @Roles('admin')
    findAll() {
        return this.usersService.findAll();
    }
}
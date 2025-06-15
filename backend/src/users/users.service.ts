// Archivo: backend/src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    // Inyectamos el modelo de Mongoose para el usuario
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    /**
 * Busca todos los usuarios en la base de datos.
 * @returns Una promesa que resuelve a un array de documentos de usuario.
 */
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    /**
 * Compara si dos arrays de roles son diferentes, ignorando el orden.
 * @param rolesFromToken Los roles obtenidos del token JWT.
 * @param rolesFromDB Los roles almacenados en la base de datos.
 * @returns `true` si los roles son diferentes, `false` en caso contrario.
 */
    private areRolesDifferent(rolesFromToken: string[], rolesFromDB: string[]): boolean {
        if (rolesFromToken.length !== rolesFromDB.length) {
            return true;
        }
        const sortedTokenRoles = [...rolesFromToken].sort().join(',');
        const sortedDBRoles = [...rolesFromDB].sort().join(',');
        return sortedTokenRoles !== sortedDBRoles;
    }

    /**
 * Busca un usuario por su ID de Auth0. Si no existe, crea uno nuevo.
 * Si el usuario existe pero sus roles en el token son diferentes a los de la base de datos, actualiza los roles.
 * @param payload El payload decodificado del token JWT de Auth0.
 * @returns Una promesa que resuelve al documento de usuario encontrado o creado.
 */
    async findOrCreateFromAuth0(payload: any): Promise<User> {
        const namespace = 'https://api.catalog-manager.com';
        const rolesFromToken = payload[`${namespace}/roles`] || [];
        const auth0Id = payload.sub;

        let user = await this.userModel.findOne({ auth0Id: auth0Id }).exec();

        if (!user) {
            const newUser = {
                auth0Id: auth0Id,
                email: payload[`${namespace}/email`],
                name: payload[`${namespace}/name`],
                roles: rolesFromToken,
            };
            // Usamos .create() para que sea más fácil de testear
            user = await this.userModel.create(newUser); // Crea un nuevo usuario si no se encuentra uno existente
        } else if (this.areRolesDifferent(rolesFromToken, user.roles)) {
            user.roles = rolesFromToken;
            user.name = payload[`${namespace}/name`];
            user.email = payload[`${namespace}/email`];
            await user.save();
        }

        return user;
    }
}
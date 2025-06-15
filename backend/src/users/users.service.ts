import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    private areRolesDifferent(rolesFromToken: string[], rolesFromDB: string[]): boolean {
        if (rolesFromToken.length !== rolesFromDB.length) {
            return true;
        }
        // Ordena ambos arreglos y los convierte a string para una comparación simple
        const sortedTokenRoles = [...rolesFromToken].sort().join(',');
        const sortedDBRoles = [...rolesFromDB].sort().join(',');

        return sortedTokenRoles !== sortedDBRoles;
    }
    // Este servicio es un ejemplo. En un caso real, podría sincronizar usuarios
    // desde Auth0 a la base de datos local cuando inician sesión por primera vez.
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findByAuth0Id(auth0Id: string): Promise<User | null> {
        return this.userModel.findOne({ auth0Id }).exec();
    }

    // --- NUEVO MÉTODO ---
    // Busca un usuario por su Auth0 ID. Si no existe, lo crea.
    // El payload del token viene de Auth0.
    async findOrCreateFromAuth0(payload: any): Promise<User> {
        console.log(`Buscando o creando usuario con Auth0 ID: ${payload.sub}`)
        const namespace = 'https://api.catalog-manager.com';
        const rolesFromToken = payload[`${namespace}/roles`] || [];
        const auth0Id = payload.sub; // 'sub' es el ID de usuario único de Auth0
        let user = await this.userModel.findOne({ auth0Id: auth0Id }).exec();

        if (!user) {
            console.log(`Creando usuario con Auth0 ID: ${auth0Id}`)
            const namespace = 'https://api.catalog-manager.com';
            const newUser = {
                auth0Id: auth0Id,
                email: payload[`${namespace}/email`] || '', // Asumiendo que el email está en el payload',
                name: payload[`${namespace}/name`] || '',   // Asumiendo que el nombre está en el payload
                // Los roles vienen del claim personalizado que configuramos
                roles: payload[`${namespace}/roles`] || []
            };
            console.log(newUser);
            user = await new this.userModel(newUser).save();
        }

        if (this.areRolesDifferent(rolesFromToken, user.roles)) {
            console.log(`Actualizando roles del usuario con Auth0 ID: ${auth0Id}`)
            user.roles = rolesFromToken;
            user.name = payload[`${namespace}/name`];
            user.email = payload[`${namespace}/email`];
            return user.save();
        }

        return user;
    }
}
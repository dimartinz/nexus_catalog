// Archivo: backend/src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    private areRolesDifferent(rolesFromToken: string[], rolesFromDB: string[]): boolean {
        if (rolesFromToken.length !== rolesFromDB.length) {
            return true;
        }
        const sortedTokenRoles = [...rolesFromToken].sort().join(',');
        const sortedDBRoles = [...rolesFromDB].sort().join(',');
        return sortedTokenRoles !== sortedDBRoles;
    }

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
            user = await this.userModel.create(newUser);
        } else if (this.areRolesDifferent(rolesFromToken, user.roles)) {
            user.roles = rolesFromToken;
            // Opcional: actualizar también otros campos
            user.name = payload[`${namespace}/name`];
            user.email = payload[`${namespace}/email`];
            await user.save();
        }

        return user;
    }
}
// Archivo: backend/src/users/users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

const mockUser = {
  _id: 'a-valid-user-id',
  auth0Id: 'auth0|123456',
  roles: ['user'],
  save: jest.fn().mockReturnThis(),
};

const auth0Payload = {
  sub: 'auth0|123456',
  'https://api.catalog-manager.com/email': 'test@example.com',
  'https://api.catalog-manager.com/name': 'Test User',
  'https://api.catalog-manager.com/roles': ['user'],
};

// Mock simple con los métodos estáticos que el servicio usa
const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreateFromAuth0', () => {
    it('should create a new user if one does not exist', async () => {
      mockUserModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      mockUserModel.create.mockResolvedValue(mockUser);

      const result = await service.findOrCreateFromAuth0(auth0Payload);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ auth0Id: auth0Payload.sub });
      expect(mockUserModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should update the user if roles are different', async () => {
      const saveMock = jest.fn();
      const existingUserInDB = { ...mockUser, roles: ['viewer'], save: saveMock };
      mockUserModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingUserInDB) });
      
      await service.findOrCreateFromAuth0(auth0Payload);

      expect(saveMock).toHaveBeenCalled();
    });

    it('should NOT update user if roles are same', async () => {
      const saveMock = jest.fn();
      const existingUserInDB = { ...mockUser, roles: ['user'], save: saveMock };
      mockUserModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingUserInDB) });
      
      await service.findOrCreateFromAuth0(auth0Payload);
      
      expect(saveMock).not.toHaveBeenCalled();
    });
  });
});
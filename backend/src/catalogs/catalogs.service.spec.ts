import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsService } from './catalogs.service';
import { getModelToken } from '@nestjs/mongoose';
import { Catalog } from './schemas/catalog.schema';
import { ConflictException } from '@nestjs/common';

const mockCatalog = {
  _id: '60c72b5a9b1d8c001f8e4a9a',
  name: 'Test Catalog',
  price: 100,
};

// Mock simple con los métodos estáticos que el servicio realmente usa
const mockCatalogModel = {
  create: jest.fn(),
  find: jest.fn(),
  // ... puedes añadir findById, etc., si los necesitas para otras pruebas
};

describe('CatalogsService', () => {
  let service: CatalogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogsService,
        {
          provide: getModelToken(Catalog.name),
          useValue: mockCatalogModel,
        },
      ],
    }).compile();

    service = module.get<CatalogsService>(CatalogsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create and return a catalog', async () => {
      const dto = { name: 'Test Catalog', price: 100 };
      mockCatalogModel.create.mockResolvedValue(mockCatalog);

      const result = await service.create(dto);

      expect(mockCatalogModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCatalog);
    });

    it('should throw a ConflictException for duplicate key error', async () => {
      mockCatalogModel.create.mockRejectedValue({ code: 11000 });

      await expect(service.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
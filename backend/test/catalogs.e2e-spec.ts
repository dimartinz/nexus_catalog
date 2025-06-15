import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthzGuard } from '../src/auth/guards/authz.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Catalog } from '../src/catalogs/schemas/catalog.schema';

describe('CatalogsController (e2e)', () => {
  let app: INestApplication;
  let catalogModel: Model<Catalog>;

  // Aumentamos el tiempo de espera para todas las pruebas en este archivo
  jest.setTimeout(30000);

  // Limpiamos la base de datos después de cada prueba para asegurar el aislamiento
  afterEach(async () => {
    if (catalogModel) {
      await catalogModel.deleteMany({});
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('As an Admin User', () => {
    beforeEach(async () => {
      const mockAdminUser = { roles: ['admin'] };
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideGuard(AuthzGuard)
        .useValue({
          canActivate: (context) => {
            const req = context.switchToHttp().getRequest();
            req.user = mockAdminUser;
            return true;
          },
        })
        .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
      await app.init();
      catalogModel = moduleFixture.get<Model<Catalog>>(getModelToken(Catalog.name));
    });

    it('/catalogs (POST) - should create a catalog', () => {
      return request(app.getHttpServer())
        .post('/catalogs')
        .send({ name: 'E2E Admin Test', price: 200 })
        .expect(201);
    });

    it('/catalogs/:id (PATCH) - should update a catalog', async () => {
        const newCatalog = await catalogModel.create({ name: 'To be updated', price: 10 });
        return request(app.getHttpServer())
            .patch(`/catalogs/${newCatalog._id}`)
            .send({ price: 150 })
            .expect(200)
            .then(res => {
                expect(res.body.price).toEqual(150);
            });
    });
  });

  describe('As a Non-Admin User', () => {
    beforeEach(async () => {
      const mockViewerUser = { roles: ['viewer'] };
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideGuard(AuthzGuard)
        .useValue({
          canActivate: (context) => {
            const req = context.switchToHttp().getRequest();
            req.user = mockViewerUser;
            return true;
          },
        })
        .overrideGuard(RolesGuard) // También sobreescribimos el RolesGuard para simular su lógica
        .useValue({
          canActivate: (context) => {
            const requiredRoles = Reflect.getMetadata('roles', context.getHandler());
            if (!requiredRoles) return true;
            const { user } = context.switchToHttp().getRequest();
            return requiredRoles.some((role) => user.roles?.includes(role));
          },
        })
        .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
      await app.init();
      catalogModel = moduleFixture.get<Model<Catalog>>(getModelToken(Catalog.name));
    });

    it('/catalogs (POST) - should return 403 Forbidden', () => {
      return request(app.getHttpServer())
        .post('/catalogs')
        .send({ name: 'Forbidden Catalog', price: 100 })
        .expect(403);
    });

    it('/catalogs (GET) - should be allowed to view catalogs', async () => {
        await catalogModel.create({ name: 'Public Catalog', price: 50 });
        return request(app.getHttpServer())
            .get('/catalogs')
            .expect(200)
            .then(res => {
                expect(res.body).toHaveLength(1);
                expect(res.body[0].name).toEqual('Public Catalog');
            });
    });
  });
});
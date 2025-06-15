import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { AuthzGuard } from '../auth/guards/authz.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  // Proteger con AuthzGuard y RolesGuard. Solo rol 'admin' puede crear.
  @Post()
  @UseGuards(AuthzGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createCatalogDto: CreateCatalogDto) {
    return this.catalogsService.create(createCatalogDto);
  }

  // Ruta pública para cualquier usuario autenticado
  @Get()
  @UseGuards(AuthzGuard)
  findAll() {
    return this.catalogsService.findAll();
  }
  
  // Ruta pública para cualquier usuario autenticado
  @Get(':id')
  @UseGuards(AuthzGuard)
  findOne(@Param('id') id: string) {
    return this.catalogsService.findOne(id);
  }

  // Proteger con AuthzGuard y RolesGuard. Solo rol 'admin' puede actualizar.
  @Patch(':id')
  @UseGuards(AuthzGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateCatalogDto: UpdateCatalogDto) {
    return this.catalogsService.update(id, updateCatalogDto);
  }

  // Proteger con AuthzGuard y RolesGuard. Solo rol 'admin' puede eliminar.
  @Delete(':id')
  @UseGuards(AuthzGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.catalogsService.remove(id);
  }
}
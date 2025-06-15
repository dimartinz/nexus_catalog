import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Importamos los DTOs para la creación y actualización de catálogos
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
// Importamos el esquema y el tipo de documento de Mongoose para el catálogo
import { Catalog, CatalogDocument } from './schemas/catalog.schema';

@Injectable()
export class CatalogsService {
  // Inyectamos el modelo de Mongoose para el catálogo
  constructor(@InjectModel(Catalog.name) private catalogModel: Model<CatalogDocument>) { }

  // Método para crear un nuevo catálogo
  async create(createCatalogDto: CreateCatalogDto): Promise<Catalog> {
    try {
      const createdCatalog = await this.catalogModel.create(createCatalogDto);
      return createdCatalog;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(`Ya existe un catálogo con el nombre "${createCatalogDto.name}"`);
      }
      throw error;
    }
  }
  
  // Método para obtener todos los catálogos
  async findAll(): Promise<Catalog[]> {
    return this.catalogModel.find().exec();
  }
  
  // Método para obtener un catálogo por su ID
  async findOne(id: string): Promise<Catalog> {
    const catalog = await this.catalogModel.findById(id).exec();
    if (!catalog) {
      // Si no se encuentra el catálogo, lanzamos una excepción NotFoundException
      throw new NotFoundException(`Catálogo con ID "${id}" no encontrado`);
    }
    return catalog;
  }
  
  // Método para actualizar un catálogo por su ID
  async update(id: string, updateCatalogDto: UpdateCatalogDto): Promise<Catalog> {
    // Buscamos y actualizamos el catálogo. { new: true } devuelve el documento actualizado.
    const existingCatalog = await this.catalogModel.findByIdAndUpdate(id, updateCatalogDto, { new: true }).exec();
    if (!existingCatalog) {
      // Si no se encuentra el catálogo, lanzamos una excepción NotFoundException
      throw new NotFoundException(`Catálogo con ID "${id}" no encontrado`);
    }
    return existingCatalog;
  }
  // Método para eliminar un catálogo por su ID
  async remove(id: string) {
    const result = await this.catalogModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Catálogo con ID "${id}" no encontrado`);
    }
    return { message: `Catálogo con ID "${id}" eliminado exitosamente` };
  }
}
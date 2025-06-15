import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Catalog, CatalogDocument } from './schemas/catalog.schema';

@Injectable()
export class CatalogsService {
  constructor(@InjectModel(Catalog.name) private catalogModel: Model<CatalogDocument>) {}

  async create(createCatalogDto: CreateCatalogDto): Promise<Catalog> {
    const createdCatalog = new this.catalogModel(createCatalogDto);
    return createdCatalog.save();
  }

  async findAll(): Promise<Catalog[]> {
    return this.catalogModel.find().exec();
  }

  async findOne(id: string): Promise<Catalog> {
    const catalog = await this.catalogModel.findById(id).exec();
    if (!catalog) {
      throw new NotFoundException(`Catálogo con ID "${id}" no encontrado`);
    }
    return catalog;
  }

  async update(id: string, updateCatalogDto: UpdateCatalogDto): Promise<Catalog> {
    const existingCatalog = await this.catalogModel.findByIdAndUpdate(id, updateCatalogDto, { new: true }).exec();
    if (!existingCatalog) {
      throw new NotFoundException(`Catálogo con ID "${id}" no encontrado`);
    }
    return existingCatalog;
  }

  async remove(id: string) {
    const result = await this.catalogModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Catálogo con ID "${id}" no encontrado`);
    }
    return { message: `Catálogo con ID "${id}" eliminado exitosamente` };
  }
}
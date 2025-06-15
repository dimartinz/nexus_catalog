import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';
export class CreateCatalogDto {
  @IsString() @IsNotEmpty() readonly name: string;
  @IsString() @IsOptional() readonly description?: string;
  @IsNumber() @Min(0) readonly price: number;
  @IsBoolean() @IsOptional() readonly isActive?: boolean;
}
import {
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class EquipamentoDto {
  @IsString() descricao: string;
  @IsNumber() quantidade: number;
  @IsNumber() valor: number;
}

export class CreateContratoDto {
  @IsString() nome: string;

  @IsOptional() @IsString() cpf?: string;
  @IsOptional() @IsString() rg?: string;
  @IsString() cidade: string;
  @IsString() endereco: string;
  @IsString() bairro: string;
  @IsString() telefone: string;
  @IsOptional() @IsEmail() email?: string;
  @IsString() dataLocacao?: string;
  @IsOptional() @IsString() dataEntrega: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipamentoDto)
  equipamentos: EquipamentoDto[];
}

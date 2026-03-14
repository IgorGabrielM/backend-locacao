import { IsString, IsEmail, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class EquipamentoDto {
  @IsString() descricao: string;
  @IsNumber() quantidade: number;
  @IsNumber() valor: number;
}

export class CreateContratoDto {
  @IsString() nome: string;
  @IsString() cpf: string;
  @IsString() rg: string;
  @IsString() cidade: string;
  @IsString() endereco: string;
  @IsString() bairro: string;
  @IsString() telefone: string;
  @IsEmail() email: string;
  @IsString() dataLocacao: string;
  @IsString() dataEntrega: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipamentoDto)
  equipamentos: EquipamentoDto[];
}
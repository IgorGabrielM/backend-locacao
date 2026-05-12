import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ContratoEquipamentoItemDto {
  @IsUUID() equipamento_id: string;
  @IsNumber() quantidade: number;
}

export class CreateContratoDto {
  @IsString() nome: string;

  @IsOptional() @IsString() cpf?: string;
  @IsOptional() @IsString() rg?: string;
  @IsString() cidade: string;
  @IsString() endereco: string;
  @IsString() bairro: string;
  @IsString() telefone: string;
  @IsOptional() email?: string;
  @IsOptional() @IsString() dataEntrega?: string;
  @IsOptional() @IsUUID() contratoPaiId?: string;
  @IsOptional() @IsNumber() frete?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContratoEquipamentoItemDto)
  equipamentos?: ContratoEquipamentoItemDto[];
}

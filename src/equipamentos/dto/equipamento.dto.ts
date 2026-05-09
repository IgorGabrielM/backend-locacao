import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateEquipamentoDto {
  @IsString()
  descricao: string;

  @IsNumber()
  valorPadrao: number;
}

export class UpdateEquipamentoDto {
  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  valorPadrao?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

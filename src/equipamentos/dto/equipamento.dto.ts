import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateEquipamentoDto {
  @IsString()
  descricao: string;

  @IsNumber()
  valor_padrao: number;
}

export class UpdateEquipamentoDto {
  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  valor_padrao?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

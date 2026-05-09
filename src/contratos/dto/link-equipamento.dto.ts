import { IsString, IsNumber } from 'class-validator';

export class LinkEquipamentoDto {
  @IsString()
  equipamentoId: string;

  @IsNumber()
  quantidade: number;

  @IsNumber()
  valorCobrado: number;
}

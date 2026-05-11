import { IsString, IsNumber } from 'class-validator';

export class LinkEquipamentoDto {
  @IsString()
  equipamento_id: string;

  @IsNumber()
  quantidade: number;
}

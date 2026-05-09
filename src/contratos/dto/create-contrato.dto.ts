import { IsString, IsOptional } from 'class-validator';

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
}

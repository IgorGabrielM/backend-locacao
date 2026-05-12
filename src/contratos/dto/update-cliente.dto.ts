import { IsString, IsOptional, IsEmail, ValidateIf } from 'class-validator';

export class UpdateClienteDto {
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsString() cpf?: string;
  @IsOptional() @IsString() rg?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @ValidateIf((o) => o.email !== '') @IsEmail() email?: string;
  @IsOptional() @IsString() endereco?: string;
}

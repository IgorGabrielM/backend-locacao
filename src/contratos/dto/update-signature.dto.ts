import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class UpdateSignatureDto {
  @IsString()
  @IsNotEmpty()
  signature: string;
}

export class UpdateClosureDto {
  @IsString()
  @IsNotEmpty()
  dataEncerramento: string;
}

export class LinkContratoPaiDto {
  @IsOptional()
  @IsUUID()
  contratoPaiId?: string | null;
}

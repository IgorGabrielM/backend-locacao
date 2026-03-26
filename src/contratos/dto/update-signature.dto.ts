import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateSignatureDto {
  @IsString()
  @IsNotEmpty()
  signature: string;
}

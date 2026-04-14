import { IsOptional, IsString } from 'class-validator';

export class UpdateLaboratoryDto {
  @IsOptional()
  @IsString()
  resultado?: string;
}

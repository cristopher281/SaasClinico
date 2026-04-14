import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLaboratoryDto {
  @IsUUID()
  consultationId: string;

  @IsOptional()
  @IsString()
  resultado?: string;
}

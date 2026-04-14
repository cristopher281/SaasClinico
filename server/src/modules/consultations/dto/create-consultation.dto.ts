import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateConsultationDto {
  @IsUUID()
  appointmentId: string;

  @IsString()
  diagnostico: string;

  @IsOptional()
  @IsString()
  tratamiento?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

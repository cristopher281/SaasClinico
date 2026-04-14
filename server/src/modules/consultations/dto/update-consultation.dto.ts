import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateConsultationDto {
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsOptional()
  @IsString()
  diagnostico?: string;

  @IsOptional()
  @IsString()
  tratamiento?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

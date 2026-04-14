import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  doctorId: string;

  @IsDateString()
  fecha: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  hora: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsIn(['pendiente', 'confirmada', 'cancelada', 'completada'])
  estado?: string;
}

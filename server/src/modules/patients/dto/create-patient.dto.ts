import { IsDateString, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @MaxLength(200)
  nombre: string;

  @IsString()
  @MaxLength(50)
  cedula: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  sexo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}

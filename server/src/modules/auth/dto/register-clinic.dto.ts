import { IsEmail, IsOptional, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterClinicDto {
  @IsString()
  @IsNotEmpty()
  clinicName: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsString()
  @IsNotEmpty()
  adminName: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(8, { message: 'La contrasena debe tener al menos 8 caracteres' })
  adminPassword: string;
}

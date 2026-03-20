import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterClinicDto {
  @IsString()
  @IsNotEmpty()
  clinicName: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  adminPassword: string;
}

import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateStaffUserDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsIn(['doctor', 'recepcionista', 'cajero'])
  rol: string;

  @IsOptional()
  @IsString()
  specialtyId?: string;

  @IsOptional()
  @IsString()
  licencia?: string;

  @IsOptional()
  @IsString()
  temporaryPassword?: string;
}

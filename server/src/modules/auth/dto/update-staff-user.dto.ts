import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateStaffUserDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(['doctor', 'recepcionista', 'cajero'])
  rol?: string;

  @IsOptional()
  @IsString()
  specialtyId?: string | null;

  @IsOptional()
  @IsString()
  licencia?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(8)
  temporaryPassword?: string;
}

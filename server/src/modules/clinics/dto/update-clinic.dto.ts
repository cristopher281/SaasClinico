import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateClinicDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  prescriptionTemplateHtml?: string;

  @IsOptional()
  @IsString()
  invoiceTemplateHtml?: string;
}

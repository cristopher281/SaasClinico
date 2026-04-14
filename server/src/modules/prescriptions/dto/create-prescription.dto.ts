import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PrescriptionMedicationItemDto {
  @IsUUID()
  medicationId: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dosis?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  frecuencia?: string;
}

export class CreatePrescriptionDto {
  @IsUUID()
  consultationId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrescriptionMedicationItemDto)
  items: PrescriptionMedicationItemDto[];
}

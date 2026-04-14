import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateInvoiceDto {
  @IsUUID()
  appointmentId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cantidadPago: number;

  @IsOptional()
  @IsString()
  concepto?: string;
}

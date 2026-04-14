import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateInvoiceDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cantidadPago?: number;

  @IsOptional()
  @IsString()
  concepto?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'parcial', 'pagada', 'cancelada'])
  estado?: string;
}

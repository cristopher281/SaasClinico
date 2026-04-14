import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  monto: number;

  @IsString()
  metodoPago: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;
}

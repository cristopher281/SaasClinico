import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MedicationsService } from '../services/medications.service';

@Controller('medications')
@UseGuards(JwtAuthGuard)
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Get()
  findAll(@Query('q') query?: string) {
    return this.medicationsService.findAll(query);
  }
}



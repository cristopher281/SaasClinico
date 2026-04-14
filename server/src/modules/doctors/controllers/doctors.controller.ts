import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../auth/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DoctorsService } from '../services/doctors.service';

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll(@CurrentUser() user: { clinicId: string }) {
    return this.doctorsService.findAll(user.clinicId);
  }

  @Get('specialties')
  findSpecialties() {
    return this.doctorsService.findSpecialties();
  }
}



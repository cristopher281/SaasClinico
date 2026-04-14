import { Body, Controller, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from '../../../auth/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ClinicsService } from '../services/clinics.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('clinics')
@UseGuards(JwtAuthGuard)
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get('current')
  getCurrentClinic(@CurrentUser() user: { clinicId: string }) {
    return this.clinicsService.findById(user.clinicId);
  }

  @Patch('current')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateCurrentClinic(
    @CurrentUser() user: { clinicId: string },
    @Body() dto: UpdateClinicDto,
  ) {
    return this.clinicsService.update(user.clinicId, dto);
  }

  @Post('current/logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  uploadCurrentClinicLogo(
    @CurrentUser() user: { clinicId: string },
    @UploadedFile() file: { originalname: string; buffer: Buffer },
  ) {
    return this.clinicsService.saveLogo(user.clinicId, file);
  }
}



import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../auth/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';
import { PrescriptionsService } from '../services/prescriptions.service';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  create(
    @CurrentUser() user: { clinicId: string },
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(user.clinicId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  findAll(
    @CurrentUser() user: { clinicId: string },
    @Query('consultationId') consultationId?: string,
  ) {
    return this.prescriptionsService.findAll(user.clinicId, consultationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  findOne(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.findOne(user.clinicId, id);
  }

  @Get(':id/preview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  preview(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.getPrescriptionPreview(user.clinicId, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  remove(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.remove(user.clinicId, id);
  }
}



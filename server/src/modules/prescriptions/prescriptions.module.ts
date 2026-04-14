import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionMedication } from './entities/prescription-medication.entity';
import { Consultation } from '../consultations/entities/consultation.entity';
import { Medication } from '../medications/entities/medication.entity';
import { PrescriptionsController } from './controllers/prescriptions.controller';
import { PrescriptionsService } from './services/prescriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prescription,
      PrescriptionMedication,
      Consultation,
      Medication,
    ]),
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}


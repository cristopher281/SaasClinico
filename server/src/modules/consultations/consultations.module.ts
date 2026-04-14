import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { ConsultationsController } from './controllers/consultations.controller';
import { ConsultationsService } from './services/consultations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation, Appointment])],
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
  exports: [ConsultationsService, TypeOrmModule],
})
export class ConsultationsModule {}


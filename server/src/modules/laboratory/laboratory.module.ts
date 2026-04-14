import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from './entities/laboratory.entity';
import { Consultation } from '../consultations/entities/consultation.entity';
import { LaboratoryController } from './controllers/laboratory.controller';
import { LaboratoryService } from './services/laboratory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Laboratory, Consultation])],
  controllers: [LaboratoryController],
  providers: [LaboratoryService],
  exports: [LaboratoryService],
})
export class LaboratoryModule {}


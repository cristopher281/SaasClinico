import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './entities/medication.entity';
import { MedicationsController } from './controllers/medications.controller';
import { MedicationsService } from './services/medications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medication])],
  controllers: [MedicationsController],
  providers: [MedicationsService],
  exports: [MedicationsService, TypeOrmModule],
})
export class MedicationsModule {}


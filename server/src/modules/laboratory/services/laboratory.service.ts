import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Laboratory } from '../entities/laboratory.entity';
import { Consultation } from '../../consultations/entities/consultation.entity';
import { CreateLaboratoryDto } from '../dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from '../dto/update-laboratory.dto';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectRepository(Laboratory)
    private readonly laboratoryRepository: Repository<Laboratory>,
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
  ) {}

  async create(clinicId: string, dto: CreateLaboratoryDto) {
    await this.findConsultationForClinic(clinicId, dto.consultationId);
    const record = this.laboratoryRepository.create({
      consultationId: dto.consultationId,
      resultado: dto.resultado,
    });
    return this.findOne(clinicId, (await this.laboratoryRepository.save(record)).id);
  }

  async findAll(clinicId: string, consultationId?: string) {
    const records = consultationId
      ? await this.laboratoryRepository.find({
          where: { consultationId },
          order: { fecha: 'DESC' },
        })
      : await this.laboratoryRepository.find({
          order: { fecha: 'DESC' },
        });

    const visible = [];
    for (const record of records) {
      try {
        visible.push(await this.findOne(clinicId, record.id));
      } catch {
        continue;
      }
    }
    return visible;
  }

  async findOne(clinicId: string, laboratoryId: string) {
    const record = await this.laboratoryRepository.findOne({
      where: { id: laboratoryId },
    });

    if (!record) {
      throw new NotFoundException('Registro de laboratorio no encontrado.');
    }

    const consultation = await this.findConsultationForClinic(clinicId, record.consultationId);
    return {
      ...record,
      consultation,
    };
  }

  async update(clinicId: string, laboratoryId: string, dto: UpdateLaboratoryDto) {
    const record = await this.laboratoryRepository.findOne({
      where: { id: laboratoryId },
    });

    if (!record) {
      throw new NotFoundException('Registro de laboratorio no encontrado.');
    }

    await this.findConsultationForClinic(clinicId, record.consultationId);
    record.resultado = dto.resultado ?? record.resultado;
    await this.laboratoryRepository.save(record);
    return this.findOne(clinicId, record.id);
  }

  async remove(clinicId: string, laboratoryId: string) {
    const record = await this.laboratoryRepository.findOne({
      where: { id: laboratoryId },
    });

    if (!record) {
      throw new NotFoundException('Registro de laboratorio no encontrado.');
    }

    await this.findConsultationForClinic(clinicId, record.consultationId);
    await this.laboratoryRepository.delete({ id: laboratoryId });
    return { message: 'Registro de laboratorio eliminado correctamente.' };
  }

  private async findConsultationForClinic(clinicId: string, consultationId: string) {
    const consultation = await this.consultationsRepository.findOne({
      where: {
        id: consultationId,
        appointment: {
          clinicId,
        },
      },
      relations: {
        appointment: {
          patient: true,
          doctor: {
            user: true,
            specialty: true,
          },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consulta no encontrada en la clinica.');
    }

    return consultation;
  }
}


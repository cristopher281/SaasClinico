import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
  ) {}

  async create(clinicId: string, dto: CreatePatientDto) {
    const existingPatient = await this.patientsRepository.findOne({
      where: {
        clinicId,
        cedula: dto.cedula,
      },
    });

    if (existingPatient) {
      throw new ConflictException('Ya existe un paciente con esa cedula en la clinica.');
    }

    const patient = this.patientsRepository.create({
      clinicId,
      ...dto,
    });

    return this.patientsRepository.save(patient);
  }

  async findAll(clinicId: string, query?: string) {
    if (!query?.trim()) {
      return this.patientsRepository.find({
        where: { clinicId },
        order: { createdAt: 'DESC' },
      });
    }

    const normalizedQuery = `%${query.trim()}%`;
    return this.patientsRepository.find({
      where: [
        { clinicId, nombre: ILike(normalizedQuery) },
        { clinicId, cedula: ILike(normalizedQuery) },
        { clinicId, email: ILike(normalizedQuery) },
        { clinicId, telefono: ILike(normalizedQuery) },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(clinicId: string, patientId: string) {
    const patient = await this.patientsRepository.findOne({
      where: {
        id: patientId,
        clinicId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado.');
    }

    return patient;
  }

  async update(clinicId: string, patientId: string, dto: UpdatePatientDto) {
    const patient = await this.findOne(clinicId, patientId);

    if (dto.cedula && dto.cedula !== patient.cedula) {
      const duplicatePatient = await this.patientsRepository.findOne({
        where: {
          clinicId,
          cedula: dto.cedula,
        },
      });

      if (duplicatePatient) {
        throw new ConflictException('Ya existe un paciente con esa cedula en la clinica.');
      }
    }

    Object.assign(patient, dto);
    return this.patientsRepository.save(patient);
  }

  async remove(clinicId: string, patientId: string) {
    const patient = await this.findOne(clinicId, patientId);
    await this.patientsRepository.softRemove(patient);
    return { message: 'Paciente eliminado correctamente.' };
  }
}


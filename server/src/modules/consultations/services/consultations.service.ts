import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from '../entities/consultation.entity';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { UpdateConsultationDto } from '../dto/update-consultation.dto';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(clinicId: string, dto: CreateConsultationDto) {
    const appointment = await this.getAppointmentForClinic(clinicId, dto.appointmentId);

    const existingConsultation = await this.consultationsRepository.findOne({
      where: { appointmentId: dto.appointmentId },
    });

    if (existingConsultation) {
      throw new ConflictException('La cita ya tiene una consulta registrada.');
    }

    const consultation = this.consultationsRepository.create({
      appointmentId: dto.appointmentId,
      diagnostico: dto.diagnostico,
      tratamiento: dto.tratamiento,
      observaciones: dto.observaciones,
    });

    const savedConsultation = await this.consultationsRepository.save(consultation);
    appointment.estado = 'completada';
    await this.appointmentsRepository.save(appointment);

    return this.findOne(clinicId, savedConsultation.id);
  }

  async findAll(clinicId: string) {
    return this.consultationsRepository.find({
      relations: {
        appointment: {
          patient: true,
          doctor: {
            user: true,
            specialty: true,
          },
        },
      },
      where: {
        appointment: {
          clinicId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(clinicId: string, consultationId: string) {
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
      throw new NotFoundException('Consulta no encontrada.');
    }

    return consultation;
  }

  async update(clinicId: string, consultationId: string, dto: UpdateConsultationDto) {
    const consultation = await this.findOne(clinicId, consultationId);

    if (dto.appointmentId && dto.appointmentId !== consultation.appointmentId) {
      throw new ConflictException('No se puede cambiar la cita asociada a una consulta.');
    }

    Object.assign(consultation, {
      diagnostico: dto.diagnostico ?? consultation.diagnostico,
      tratamiento: dto.tratamiento ?? consultation.tratamiento,
      observaciones: dto.observaciones ?? consultation.observaciones,
    });

    return this.consultationsRepository.save(consultation);
  }

  async remove(clinicId: string, consultationId: string) {
    const consultation = await this.findOne(clinicId, consultationId);
    await this.consultationsRepository.softRemove(consultation);
    return { message: 'Consulta eliminada correctamente.' };
  }

  private async getAppointmentForClinic(clinicId: string, appointmentId: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: appointmentId, clinicId },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada en la clinica.');
    }

    return appointment;
  }
}


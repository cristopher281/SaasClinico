import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorsRepository: Repository<Doctor>,
  ) {}

  async create(clinicId: string, dto: CreateAppointmentDto) {
    await this.ensureOwnership(clinicId, dto.patientId, dto.doctorId);
    await this.ensureSlotAvailability(clinicId, dto.doctorId, dto.fecha, dto.hora);

    const appointment = this.appointmentsRepository.create({
      clinicId,
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      fecha: dto.fecha,
      hora: dto.hora,
      motivo: dto.motivo,
      estado: dto.estado ?? 'pendiente',
    });

    return this.appointmentsRepository.save(appointment);
  }

  findAll(
    clinicId: string,
    filters: {
      fecha?: string;
      desde?: string;
      hasta?: string;
      doctorId?: string;
      patientId?: string;
      estado?: string;
    },
  ) {
    const where: Record<string, unknown> = { clinicId };

    if (filters.fecha) {
      where.fecha = filters.fecha;
    } else if (filters.desde && filters.hasta) {
      where.fecha = Between(filters.desde, filters.hasta);
    }

    if (filters.doctorId) {
      where.doctorId = filters.doctorId;
    }

    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters.estado) {
      where.estado = filters.estado;
    }

    return this.appointmentsRepository.find({
      where,
      relations: {
        patient: true,
        doctor: {
          user: true,
          specialty: true,
        },
      },
      order: {
        fecha: 'ASC',
        hora: 'ASC',
      },
    });
  }

  async findOne(clinicId: string, appointmentId: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: {
        id: appointmentId,
        clinicId,
      },
      relations: {
        patient: true,
        doctor: {
          user: true,
          specialty: true,
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada.');
    }

    return appointment;
  }

  async update(clinicId: string, appointmentId: string, dto: UpdateAppointmentDto) {
    const appointment = await this.findOne(clinicId, appointmentId);

    const patientId = dto.patientId ?? appointment.patientId;
    const doctorId = dto.doctorId ?? appointment.doctorId;
    await this.ensureOwnership(clinicId, patientId, doctorId);

    const fecha = dto.fecha ?? appointment.fecha;
    const hora = dto.hora ?? appointment.hora;
    if (doctorId !== appointment.doctorId || fecha !== appointment.fecha || hora !== appointment.hora) {
      await this.ensureSlotAvailability(clinicId, doctorId, fecha, hora, appointment.id);
    }

    Object.assign(appointment, {
      patientId,
      doctorId,
      fecha,
      hora,
      estado: dto.estado ?? appointment.estado,
      motivo: dto.motivo ?? appointment.motivo,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async remove(clinicId: string, appointmentId: string) {
    const appointment = await this.findOne(clinicId, appointmentId);
    await this.appointmentsRepository.remove(appointment);
    return { message: 'Cita eliminada correctamente.' };
  }

  private async ensureOwnership(clinicId: string, patientId: string, doctorId: string) {
    const [patient, doctor] = await Promise.all([
      this.patientsRepository.findOne({ where: { id: patientId, clinicId } }),
      this.doctorsRepository.findOne({ where: { id: doctorId, clinicId, activo: true } }),
    ]);

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado en la clinica.');
    }

    if (!doctor) {
      throw new NotFoundException('Doctor no encontrado en la clinica.');
    }
  }

  private async ensureSlotAvailability(
    clinicId: string,
    doctorId: string,
    fecha: string,
    hora: string,
    excludeAppointmentId?: string,
  ) {
    const where: Record<string, unknown> = {
      clinicId,
      doctorId,
      fecha,
      hora,
    };

    const existingAppointment = await this.appointmentsRepository.findOne({
      where,
    });

    if (existingAppointment && existingAppointment.id !== excludeAppointmentId) {
      throw new ConflictException('El doctor ya tiene una cita asignada en esa fecha y hora.');
    }
  }
}


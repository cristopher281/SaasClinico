import {
  BadRequestException,
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { RegisterClinicDto } from '../dto/register-clinic.dto';
import { LoginDto } from '../dto/login.dto';
import { CreateStaffUserDto } from '../dto/create-staff-user.dto';
import { UpdateStaffUserDto } from '../dto/update-staff-user.dto';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Specialty } from '../../doctors/entities/specialty.entity';
import { NotificationDispatcherService } from './notification-dispatcher.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(Doctor)
    private readonly doctorsRepository: Repository<Doctor>,
    @InjectRepository(Specialty)
    private readonly specialtiesRepository: Repository<Specialty>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly notificationDispatcherService: NotificationDispatcherService,
  ) {}

  async registerClinic(dto: RegisterClinicDto) {
    const { clinicName, taxId, logoUrl, adminName, adminEmail, adminPassword } = dto;

    const existingUser = await this.userRepository.findOne({
      where: { email: adminEmail },
    });
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado.');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const clinic = queryRunner.manager.create(Clinic, {
        nombre: clinicName,
        taxId: taxId ?? null,
        logoUrl: logoUrl ?? null,
      });
      const savedClinic = await queryRunner.manager.save(clinic);

      const user = queryRunner.manager.create(User, {
        clinicId: savedClinic.id,
        nombre: adminName,
        email: adminEmail,
        passwordHash,
        rol: 'admin',
      });
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return {
        message: 'Clinica registrada exitosamente',
        clinicId: savedClinic.id,
        role: user.rol,
        clinic: savedClinic,
        access_token: await this.signToken(user),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { clinic: true },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    return {
      access_token: await this.signToken(user),
      role: user.rol,
      clinicId: user.clinicId,
      clinic: user.clinic,
    };
  }

  async listStaff(clinicId: string) {
    const users = await this.userRepository.find({
      where: { clinicId },
      relations: { clinic: true },
      order: { createdAt: 'DESC' },
    });

    const doctors = await this.doctorsRepository.find({
      where: { clinicId },
      relations: { specialty: true },
    });

    return users.map((user) => {
      const doctorProfile = doctors.find((doctor) => doctor.userId === user.id);
      return {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        createdAt: user.createdAt,
        specialtyId: doctorProfile?.specialtyId ?? null,
        specialty: doctorProfile?.specialty ?? null,
        licencia: doctorProfile?.licencia ?? null,
      };
    });
  }

  async createStaffUser(clinicId: string, dto: CreateStaffUserDto) {
    const clinic = await this.clinicRepository.findOne({ where: { id: clinicId } });
    if (!clinic) {
      throw new NotFoundException('Clinica no encontrada.');
    }

    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('El correo ya esta registrado.');
    }

    if (dto.rol === 'doctor' && !dto.specialtyId) {
      throw new BadRequestException('Un doctor debe tener especialidad asignada.');
    }

    const password = dto.temporaryPassword ?? this.generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = queryRunner.manager.create(User, {
        clinicId,
        nombre: dto.nombre,
        email: dto.email,
        passwordHash,
        rol: dto.rol,
      });
      const savedUser = await queryRunner.manager.save(user);

      if (dto.rol === 'doctor') {
        await this.assertSpecialtyExists(dto.specialtyId as string);
        const doctor = queryRunner.manager.create(Doctor, {
          clinicId,
          userId: savedUser.id,
          specialtyId: dto.specialtyId ?? null,
          licencia: dto.licencia ?? null,
          activo: true,
        });
        await queryRunner.manager.save(doctor);
      }

      await queryRunner.commitTransaction();

      const notification = await this.notificationDispatcherService.sendTemporaryCredentials({
        clinicName: clinic.nombre,
        recipientName: savedUser.nombre,
        recipientEmail: savedUser.email,
        role: savedUser.rol,
        temporaryPassword: password,
      });

      return {
        message: 'Usuario de staff creado correctamente.',
        temporaryPassword: password,
        notification,
        user: await this.findStaffUser(clinicId, savedUser.id),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateStaffUser(clinicId: string, staffUserId: string, dto: UpdateStaffUserDto) {
    const user = await this.findStaffUserRecord(clinicId, staffUserId);

    if (dto.email && dto.email !== user.email) {
      const duplicate = await this.userRepository.findOne({ where: { email: dto.email } });
      if (duplicate) {
        throw new ConflictException('El correo ya esta registrado.');
      }
    }

    if (dto.rol === 'doctor' && !dto.specialtyId) {
      throw new BadRequestException('Un doctor debe tener especialidad asignada.');
    }

    if (dto.specialtyId) {
      await this.assertSpecialtyExists(dto.specialtyId);
    }

    Object.assign(user, {
      nombre: dto.nombre ?? user.nombre,
      email: dto.email ?? user.email,
      rol: dto.rol ?? user.rol,
    });

    if (dto.temporaryPassword) {
      user.passwordHash = await bcrypt.hash(dto.temporaryPassword, await bcrypt.genSalt());
    }

    await this.userRepository.save(user);
    await this.syncDoctorProfile(clinicId, user.id, user.rol, dto.specialtyId, dto.licencia);

    return {
      message: 'Usuario de staff actualizado correctamente.',
      user: await this.findStaffUser(clinicId, user.id),
    };
  }

  async removeStaffUser(clinicId: string, staffUserId: string) {
    const user = await this.findStaffUserRecord(clinicId, staffUserId);
    if (user.rol === 'admin') {
      throw new BadRequestException('No se puede eliminar al administrador maestro desde este endpoint.');
    }

    const doctorProfile = await this.doctorsRepository.findOne({
      where: { clinicId, userId: user.id },
    });

    if (doctorProfile) {
      await this.doctorsRepository.softRemove(doctorProfile);
    }

    await this.userRepository.softRemove(user);
    return { message: 'Usuario de staff eliminado correctamente.' };
  }

  async me(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { clinic: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      clinicId: user.clinicId,
      clinic: user.clinic,
    };
  }

  private signToken(user: User) {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      clinicId: user.clinicId,
      role: user.rol,
    });
  }

  private async findStaffUser(clinicId: string, staffUserId: string) {
    const [user, doctorProfile] = await Promise.all([
      this.findStaffUserRecord(clinicId, staffUserId),
      this.doctorsRepository.findOne({
        where: { clinicId, userId: staffUserId },
        relations: { specialty: true },
      }),
    ]);

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      createdAt: user.createdAt,
      specialtyId: doctorProfile?.specialtyId ?? null,
      specialty: doctorProfile?.specialty ?? null,
      licencia: doctorProfile?.licencia ?? null,
    };
  }

  private async findStaffUserRecord(clinicId: string, staffUserId: string) {
    const user = await this.userRepository.findOne({
      where: { id: staffUserId, clinicId },
    });

    if (!user) {
      throw new NotFoundException('Usuario de staff no encontrado.');
    }

    return user;
  }

  private async syncDoctorProfile(
    clinicId: string,
    userId: string,
    role: string,
    specialtyId?: string | null,
    licencia?: string | null,
  ) {
    const existingProfile = await this.doctorsRepository.findOne({
      where: { clinicId, userId },
    });

    if (role !== 'doctor') {
      if (existingProfile) {
        await this.doctorsRepository.softRemove(existingProfile);
      }
      return;
    }

    if (!specialtyId) {
      throw new BadRequestException('Un doctor debe tener especialidad asignada.');
    }

    if (existingProfile) {
      Object.assign(existingProfile, {
        specialtyId,
        licencia: licencia ?? existingProfile.licencia ?? null,
        activo: true,
      });
      await this.doctorsRepository.save(existingProfile);
      return;
    }

    const doctor = this.doctorsRepository.create({
      clinicId,
      userId,
      specialtyId,
      licencia: licencia ?? null,
      activo: true,
    });
    await this.doctorsRepository.save(doctor);
  }

  private async assertSpecialtyExists(specialtyId: string) {
    const specialty = await this.specialtiesRepository.findOne({ where: { id: specialtyId } });
    if (!specialty) {
      throw new NotFoundException('Especialidad no encontrada.');
    }
  }

  private generateTemporaryPassword() {
    const random = Math.random().toString(36).slice(-6).toUpperCase();
    return `Clinica${random}`;
  }
}


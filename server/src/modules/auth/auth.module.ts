import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { Clinic } from '../clinics/entities/clinic.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { env } from '../../config/env';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Specialty } from '../doctors/entities/specialty.entity';
import { RolesGuard } from './guards/roles.guard';
import { NotificationDispatcherService } from './services/notification-dispatcher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Clinic, Doctor, Specialty]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: env.jwt.secret,
      signOptions: { expiresIn: env.jwt.expiresIn },
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard, NotificationDispatcherService],
  controllers: [AuthController],
  exports: [AuthService, TypeOrmModule],
})
export class AuthModule {}


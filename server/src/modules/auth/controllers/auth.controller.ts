import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterClinicDto } from '../dto/register-clinic.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/current-user.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateStaffUserDto } from '../dto/create-staff-user.dto';
import { UpdateStaffUserDto } from '../dto/update-staff-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-clinic')
  register(@Body() registerDto: RegisterClinicDto) {
    return this.authService.registerClinic(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { sub: string }) {
    return this.authService.me(user.sub);
  }

  @Get('staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  listStaff(@CurrentUser() user: { clinicId: string }) {
    return this.authService.listStaff(user.clinicId);
  }

  @Post('staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createStaff(
    @CurrentUser() user: { clinicId: string },
    @Body() dto: CreateStaffUserDto,
  ) {
    return this.authService.createStaffUser(user.clinicId, dto);
  }

  @Patch('staff/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStaff(
    @CurrentUser() user: { clinicId: string },
    @Param('id') staffUserId: string,
    @Body() dto: UpdateStaffUserDto,
  ) {
    return this.authService.updateStaffUser(user.clinicId, staffUserId, dto);
  }

  @Delete('staff/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeStaff(
    @CurrentUser() user: { clinicId: string },
    @Param('id') staffUserId: string,
  ) {
    return this.authService.removeStaffUser(user.clinicId, staffUserId);
  }
}



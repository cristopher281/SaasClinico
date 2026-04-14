import { Controller, Get } from '@nestjs/common';
import { env } from '../../../config/env';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    };
  }
}



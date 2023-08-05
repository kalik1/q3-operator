import { Get, Injectable } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  @Get('/healthz')
  getHealthz(): string {
    return 'Ok';
  }
}

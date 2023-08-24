import { Module } from '@nestjs/common';
import { Q3modService } from './q3mod.service';
import { Q3modController } from './q3mod.controller';

@Module({
  controllers: [Q3modController],
  providers: [Q3modService]
})
export class Q3modModule {}

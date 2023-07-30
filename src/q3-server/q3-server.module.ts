import { Module } from '@nestjs/common';
import { Q3ServerService } from './q3-server.service';
import { Q3ServerController } from './q3-server.controller';
import { KubeModule } from '../kube-module/kube.module';

@Module({
  imports: [KubeModule],
  controllers: [Q3ServerController],
  providers: [Q3ServerService],
})
export class Q3ServerModule {}

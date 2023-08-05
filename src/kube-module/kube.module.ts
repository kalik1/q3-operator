import { Module } from '@nestjs/common';
import { KubeService } from './kube/kube.service';
import { ReconcilierService } from './reconcilier.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [KubeService, ReconcilierService],
  exports: [KubeService],
})
export class KubeModule {}

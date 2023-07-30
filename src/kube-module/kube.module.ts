import { Module } from '@nestjs/common';
import { KubeService } from './kube/kube.service';
import { ReconcilierService } from './reconcilier.service';

@Module({
  providers: [KubeService, ReconcilierService],
  exports: [KubeService],
})
export class KubeModule {}

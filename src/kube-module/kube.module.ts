import { Module } from '@nestjs/common';
import { KubeService } from './kube/kube.service';
import { ReconcilierService } from './reconcilier.service';
import { HttpModule } from '@nestjs/axios';
import { ModsReconcilierService } from './reconcilier-mod.service';

@Module({
  imports: [HttpModule],
  providers: [KubeService, ReconcilierService, ModsReconcilierService],
  exports: [KubeService],
})
export class KubeModule {}

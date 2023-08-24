import { Injectable, Logger } from '@nestjs/common';
import { KubeService } from './kube/kube.service';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { baseQ3ServerPvc } from './kube/templates/base-q3-server.pvc';
import { baseQ3ServerPakDownloadJob } from './kube/templates/base-q3-server-pak-download.job';
import * as jsonpatch from 'fast-json-patch';
import { Q3mod } from '../api/q3mod/entities/q3mod.entity';
import { DatapackStatus } from '../api/q3mod/q3mod-status.enum';
import { deepClone } from 'fast-json-patch';

@Injectable()
export class ModsReconcilierService {
  logger = new Logger('Mods-Reconcilier');
  workingQueue: Set<string> = new Set();
  constructor(
    private readonly kubeService: KubeService,
    private readonly httpService: HttpService,
  ) {
    this.kubeService.watcher(this, 'mods', this.watcher).catch(console.error);
  }

  @Cron('* * * * * 1')
  async getModsInfo() {
    // TODO: Function to Check Packs Integrity & Consistency
    //console.log(servers.map((s) => s.status));
  }
  async watcher(type: string, obj: Q3mod) {
    const objInK8s = deepClone(obj);
    if (type === 'ADDED' || type === 'MODIFIED') {
      for (const pack of obj.spec.datapacks) {
        if (this.workingQueue.has(pack.name)) continue;
        this.workingQueue.add(pack.name);
        const packStatusIdx = obj.status.datapacks.findIndex(
          (ps) => ps.name === pack.name,
        );
        const packStatus = obj.status.datapacks[packStatusIdx];
        if (!packStatus) {
          obj.status.datapacks.push({
            name: pack.name,
            status: DatapackStatus.New,
            message: 'Pack Detected',
          });
          const updates = this.generateStatusUpdates(
            objInK8s.status,
            obj.status,
          );
          objInK8s.status = await this.updateStatusRaw(objInK8s, updates);
        } else if (packStatus.status === DatapackStatus.New) {
          obj.status.datapacks[packStatusIdx].status =
            DatapackStatus.Downloading;
          const updates = this.generateStatusUpdates(
            objInK8s.status,
            obj.status,
          );
          await this.updateStatusRaw(objInK8s, updates);
          this.logger.log(`Download Datapack ${pack.name}`);
          await this.downloadDataPack(pack, obj);
        } else if (packStatus.status === DatapackStatus.Downloading) {
          // TODO: detect Stuck Job
          // const downloadJobs = await this.kubeService.getJobByLabel(pack.name);
          // const pvc = await this.kubeService.getPvc(pack.name);
          // if (pvc) {
          //   // obj.status.datapacks[packStatusIdx].status =
          //   //   DatapackStatus.Downloaded;
          //   // const updates = this.generateStatusUpdates(
          //   //   objInK8s.status,
          //   //   obj.status,
          //   // );
          //   // await this.updateStatusRaw(objInK8s, updates);
          // } else if (
          //   downloadJobs.items.filter((j) => j.status.succeeded !== 1)
          //     .length === 0
          // ) {
          //   obj.status.datapacks[packStatusIdx].status = DatapackStatus.New;
          //   const updates = this.generateStatusUpdates(
          //     objInK8s.status,
          //     obj.status,
          //   );
          //   await this.updateStatusRaw(objInK8s, updates);
          // }
        } else if (packStatus.status === DatapackStatus.Downloaded) {
          // TODO: detect Stuck Job / Invalid Pack
          // const pvc = await this.kubeService.getPvc(pack.name);
          // if (!pvc) {
          //   obj.status.datapacks[packStatusIdx].status = DatapackStatus.New;
          //   const updates = this.generateStatusUpdates(
          //     objInK8s.status,
          //     obj.status,
          //   );
          //   await this.updateStatusRaw(objInK8s, updates);
          // }
        }
        this.workingQueue.delete(pack.name);
        // TODO: delete Unused Datapacks after Mod Change
      }
    }
    if (type === 'DELETED') {
      for (const pack of obj.spec.datapacks) {
        await this.deleteDataPack(pack, obj);
      }
    }
  }

  async deleteDataPack(
    pack: Q3mod['spec']['datapacks'][number],
    obj: Q3mod,
  ): Promise<Q3mod> {
    let isPackUsed = false;
    const mods = (await this.kubeService.getMods()) as Q3mod[];
    mods
      .filter((mod) => mod.metadata.name !== obj.metadata.name)
      .forEach((mod) => {
        mod.spec.datapacks.forEach((dp) => {
          if (dp.name === pack.name) isPackUsed = true;
        });
      });
    if (!isPackUsed) {
      const pvc = await this.kubeService.getPvc(pack.name);
      if (pvc) {
        const jobs = await this.kubeService.getJobByLabel(pack.name);
        for (const j of jobs.items) {
          await this.kubeService.deleteJob(j.metadata.name);
          const pods = await this.kubeService.getPodByJobName(j.metadata.name);
          for (const p of pods.items) {
            await this.kubeService.deletePod(p.metadata.name);
          }
        }
        await this.kubeService.removePvc(pvc.metadata.name);
      }
      return obj;
    }
  }

  async downloadDataPack(
    pack: Q3mod['spec']['datapacks'][number],
    obj: Q3mod,
  ): Promise<Q3mod> {
    const objInK8s = deepClone(obj);
    const pvc = await this.kubeService.getPvc(pack.name);
    const dataPackStatusIdx = obj.status.datapacks.findIndex(
      (dps) => dps.name === pack.name,
    );
    if (!pvc) {
      const a = await firstValueFrom(this.httpService.head(pack.uri));
      const pvcMinSizeMib = Math.ceil(
        parseInt(
          a.headers['content-length'] ||
            a.headers['Content-Length'] ||
            '10000000',
        ) /
          1024 /
          1024 +
          10,
      );
      try {
        this.logger.log(`Creating PVC ${pack.name}`);
        await this.kubeService.createPvc(
          baseQ3ServerPvc(pack.name, pvcMinSizeMib),
        );
      } catch (e) {
        this.logger.log(
          'Error Creating PVC, probably some1else in handling this.',
        );
        return;
      }

      const jobName = 'download-' + pack.name + '-' + Date.now() + '-job';
      obj.status.datapacks[dataPackStatusIdx].job = jobName;
      let updates = this.generateStatusUpdates(objInK8s.status, obj.status);
      objInK8s.status = await this.updateStatusRaw(objInK8s, updates);
      await this.kubeService.createJob(
        baseQ3ServerPakDownloadJob(jobName, pack.name, pack),
      );
      this.logger.log(`Creating JOB ${pack.name}`);
      await this.kubeService.waitForK8sJobDone(jobName);
      this.logger.log(`JOB ${pack.name} Done`);
      // obj.status.datapacks[dataPackStatusIdx].job = null;
      obj.status.datapacks[dataPackStatusIdx].status =
        DatapackStatus.Downloaded;
      updates = this.generateStatusUpdates(objInK8s.status, obj.status);
      objInK8s.status = await this.updateStatusRaw(objInK8s, updates);
    } else {
      this.logger.log(`Pvc ${pack.name} Already Exists`);
      obj.status.datapacks[dataPackStatusIdx].status =
        DatapackStatus.Downloaded;
      const updates = this.generateStatusUpdates(objInK8s.status, obj.status);
      console.log(updates);
      objInK8s.status = await this.updateStatusRaw(objInK8s, updates);
    }
    return obj;
  }

  private async reconciliateExisting(
    obj: Q3mod,
    deploymentName: string,
    confMapName: string,
    serviceAppName: string,
    name: string,
  ) {
    //TODO: Reconciliation logics
  }

  private generateStatusUpdates(
    originalDoc: Record<string, any>,
    patch: Record<string, any>,
    removeNotExisting = false,
  ) {
    const fullPatch = jsonpatch.compare(
      { status: originalDoc },
      { status: patch },
    );
    if (!removeNotExisting)
      return fullPatch.filter((operation) => operation.op !== 'remove');
    return fullPatch;
  }

  private async updateStatus(
    obj: Record<string, any>,
    data: Record<string, any>,
    path = '/status',
    replace: false,
  ) {
    try {
      const e = await this.kubeService.setStatus(obj.metadata.name, 'mods', [
        {
          op: replace ? 'replace' : 'add',
          path: path,
          value: data,
        },
      ]);
      // console.log(e.body);
    } catch (e) {
      console.error(e);
    }
  }

  private async updateStatusRaw(
    obj: Record<string, any>,
    patch: jsonpatch.Operation[],
  ): Promise<Q3mod['status']> {
    try {
      return (await this.kubeService.setStatus(
        obj.metadata.name,
        'mods',
        patch,
      )) as Q3mod['status'];
    } catch (e) {
      console.error(e);
    }
  }
}

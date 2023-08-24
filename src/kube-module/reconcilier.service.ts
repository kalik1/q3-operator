import { Injectable, Logger } from '@nestjs/common';
import { KubeService } from './kube/kube.service';
import { Cron } from '@nestjs/schedule';
import { baseQ3ServerDeployment } from './kube/templates/base-q3-server.deployment';
import { baseQ3ServerService } from './kube/templates/base-q3-server.service';
import * as process from 'process';
import { baserServerConfig } from './kube/templates/server.cfg';
import { Q3Server } from '../api/q3-server/entities/q3-server.entity';
import { HttpService } from '@nestjs/axios';
import { Q3ServerRcon } from './utils/q3-server-rcon.class';
import * as jsonpatch from 'fast-json-patch';
import { V1Deployment, V1Service } from '@kubernetes/client-node';
import { Q3mod } from '../api/q3mod/entities/q3mod.entity';

@Injectable()
export class ReconcilierService {
  logger = new Logger('Reconcilier');
  constructor(
    private readonly kubeService: KubeService,
    private readonly httpService: HttpService,
  ) {
    this.kubeService
      .watcher(this, 'servers', this.watcher)
      .catch(console.error);
    //this.getServersInfo();
  }
  runningStates = ['Started', 'Detected', 'Deployed'];

  @Cron('* * * * * 1')
  async getServersInfo() {
    const servers = (await this.kubeService.getServers()).items as Array<
      Record<string, any>
    >;
    servers
      //.filter((s) => runningStates.includes(s.status))
      .map(async (server) => {
        const services = await this.kubeService.getServicesWithAppLabel(
          'quake3-server-' + server.metadata.name,
        );
        const service = services[0];
        if (!service) {
          console.error(
            `service for ${'quake3-server-' + server.metadata.name} not found`,
          );
          return;
        }

        // const service = services.find((s) =>
        //   s.spec.ports.find((port) => port.port),
        // );
        const currentPort = service.spec.ports;
        //console.log(currentPort);
        const confMap = await this.kubeService.getConfigMap(
          'quake3-server-' + server.metadata.name,
        );
        const ports = service.spec.ports;
        for (const p of ports) {
          const q3rcon = new Q3ServerRcon({
            address: '127.0.0.1',
            port: p.port, // optional
            password: this.getConfigValue(
              confMap.data['server.cfg'],
              'seta rconpassword',
            ),
            //debug: true, // optional
          });
          try {
            const serverInfo = await q3rcon.serverInfo();
            // const updates = this.generateUpdates(server.status, {
            //   serverStatus: serverInfo,
            //   state: 'Running',
            // });
            // // console.log(updates);
            // await this.updateStatusRaw(server, updates);
            await this.updateStatus(server, serverInfo, '/status/serverStatus');
          } catch (e) {
            console.error(`rcon error: ${e}`);
          }
        }
      });
    //console.log(servers.map((s) => s.status));
  }
  async watcher(type: string, obj: Q3Server) {
    const name = obj.metadata.name;
    const confMapName = 'quake3-server-' + name;
    const serviceAppName = 'quake3-server-' + obj.metadata.name;
    const serviceName = 'quake3-server-' + obj.metadata.name + '-service';
    const deploymentName = 'quake3-server-' + obj.metadata.name;

    if (type === 'ADDED' || type === 'MODIFIED') {
      if (!obj.status) {
        try {
          await this.CreateNewStatus(obj);
          return;
        } catch (e) {
          return;
        }
      } else if (obj.status.state === 'Created') {
        await this.SetDetectedNewStatus(obj);
        return;
      }
      if (this.runningStates.includes(obj.status.state)) {
        // console.log(obj);
        await this.reconciliateExisting(
          obj,
          deploymentName,
          confMapName,
          serviceAppName,
          name,
        );
      }
    }
    if (type === 'DELETED') {
      // console.log('deleted');
      // await this.updateStatus(obj, {
      //   state: 'Deleting',
      //   message: 'Deleting server',
      // });
      try {
        const res = await this.kubeService.deleteQ3Deployment(deploymentName);
        console.log(
          `Deployment eliminato con successo: ${res.body.details.name}`,
        );
      } catch (e) {
        console.error("Errore durante l'eliminazione del deployment: ", e.body);
      }
      try {
        const res = await this.kubeService.deleteQ3Service(serviceName);
        console.log(
          `Service eliminato con successo: ${res.body.metadata.name}`,
        );
      } catch (e) {
        console.error("Errore durante l'eliminazione del Service: ", e);
      }
      try {
        const res = await this.kubeService.deleteConfigMap(confMapName);
        console.log(res, `ConfigMap eliminato con successo: ${1}`);
      } catch (e) {
        console.error("Errore durante l'eliminazione della configMap: ", e);
      }
    }
  }

  private async reconciliateExisting(
    obj: Q3Server,
    deploymentName: string,
    confMapName: string,
    serviceAppName: string,
    name: string,
  ) {
    const portMin = parseInt(process.env.MIN_NODEPORT || '30000');
    const portMax = parseInt(process.env.MAX_NODEPORT || '32767');

    const port = await this.kubeService.getFreeNodePort(portMin, portMax);
    if (!port) {
      const msg = `Cant find a valid port in range ${portMin}, ${portMax}`;
      this.logger.error(msg);
      this.updateStatus(obj, { state: 'Failed', message: msg }).catch(
        console.error,
      );
    }

    const modData: Q3mod = await this.kubeService.getMod(obj.spec.q3.mod);

    if (!modData) {
      console.error(`mod ${obj.spec.q3.mod} not found.`);
      return;
    }

    const baseQ3Deplyment: V1Deployment = baseQ3ServerDeployment(
      deploymentName,
      {
        confMapName,
      },
      modData,
    );
    const baseQ3Service: V1Service = baseQ3ServerService(serviceAppName, port);
    if (obj.spec.service.type) baseQ3Service.spec.type = obj.spec.service.type;
    if (obj.spec.service.externaIp)
      baseQ3Service.spec.externalIPs = [obj.spec.service.externaIp];
    if (obj.spec.service.nodePort) {
      const q3portIdx = baseQ3Service.spec.ports.findIndex(
        (port) => port.port === 27960,
      );
      if (q3portIdx === -1) {
        console.error("Can't find port for nodeport!");
      }
      baseQ3Service.spec.ports[q3portIdx].nodePort = obj.spec.service.nodePort;
    }

    let baseQ3ServerConfig = baserServerConfig;

    const confMap = await this.kubeService.getConfigMap(confMapName);
    if (!confMap) {
      baseQ3ServerConfig = this.replaceConfigValue(
        baseQ3ServerConfig,
        'seta sv_hostname',
        name,
      );
      baseQ3ServerConfig = this.replaceConfigValue(
        baseQ3ServerConfig,
        'seta rconpassword',
        Date.now().toString(16),
      );
      await this.kubeService.createConfigMapFromFile(confMapName, {
        serverConf: baseQ3ServerConfig,
      });
    } else {
      //TODO: verificare che sia bona, aventualemnte aggiornarla
    }
    const deployment = await this.kubeService.getDeployment(deploymentName);
    if (!deployment) {
      this.kubeService
        .createQ3Deployment(baseQ3Deplyment)
        .catch((e) => console.error(e.body));
      await this.updateStatus(obj, {
        state: 'Started',
        message: 'Q3 Server Running',
      });
    }
    const service = await this.kubeService.getServicesWithAppLabel(
      serviceAppName,
    );
    if (service.length === 0) {
      this.kubeService.createQ3Service(baseQ3Service).catch(console.error);
    }
  }

  private async CreateNewStatus(obj: Record<string, any>) {
    try {
      const e = await this.kubeService.setStatus(obj.metadata.name, 'servers', [
        {
          op: 'add',
          path: '/status',
          value: {
            state: 'Created', // sostituisci con il tuo stato
            message: 'Detected From Operator', // sostituisci con il tuo messaggio
          },
        },
      ]);
      // console.log(e);
    } catch (e) {
      console.error(e);
    }
  }

  private async SetDetectedNewStatus(obj: Record<string, any>) {
    try {
      const e = await this.kubeService.setStatus(obj.metadata.name, 'servers', [
        {
          op: 'replace',
          path: '/status',
          value: {
            state: 'Detected', // sostituisci con il tuo stato
            message: 'Detected From Operator', // sostituisci con il tuo messaggio
          },
        },
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  private generateUpdates(
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
  ) {
    try {
      const e = await this.kubeService.setStatus(obj.metadata.name, 'servers', [
        {
          op: 'add',
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
  ) {
    try {
      const e = await this.kubeService.setStatus(
        obj.metadata.name,
        'servers',
        patch,
      );
      console.log(e);
    } catch (e) {
      console.error(e);
    }
  }

  private replaceConfigValue(
    configString: string,
    key: string,
    newValue: string | null | undefined,
  ): string {
    // Se newValue è undefined, elimina l'intera riga
    if (newValue === undefined) {
      const regex = new RegExp(`(^${key} .*\n)`, 'gm');
      return configString.replace(regex, '');
    }

    // Se newValue è null, impostare il valore a ''
    if (newValue === null) {
      newValue = '';
    }

    // Crea un'espressione regolare per identificare la riga con la chiave specificata
    const regex = new RegExp(`(^${key} .*)`, 'gm');

    // Sostituisci il valore associato alla chiave con il nuovo valore
    const newConfigString = configString.replace(regex, `${key} ${newValue}`);

    return newConfigString;
  }

  getConfigValue(configString: string, key: string) {
    // Crea un'espressione regolare per identificare la riga con la chiave specificata e catturare il valore
    const regex = new RegExp(`^${key} (\\S+)`, 'gm');
    const match = regex.exec(configString);

    // Se la chiave è stata trovata, ritorna il valore associato, altrimenti ritorna null
    return match ? match[1] : null;
  }
}

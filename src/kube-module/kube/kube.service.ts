import { Injectable, Logger } from '@nestjs/common';
import {
  AppsV1Api,
  CoreV1Api,
  CustomObjectsApi,
  KubeConfig,
  PatchUtils,
  V1ConfigMap,
  Watch,
} from '@kubernetes/client-node';
import * as fs from 'fs';
import { CreateQ3ServerDto } from '../../q3-server/dto/create-q3-server.dto';
import { kubeQ3apiDefaultServer } from './templates/kube-q3api-default.server';
import { q3ServerCrDefinitionManifest } from './templates/server-q3-cr.manifest';
import * as process from 'process';
import { API_VERSION } from '../../const';

@Injectable()
export class KubeService {
  kc = new KubeConfig();
  k8sApi: CoreV1Api;
  q3K8sApi: CustomObjectsApi;
  k8sAppsApi: AppsV1Api;

  namespace = process.env.NAMESPACE || 'q3-operator';
  kubeLogger = new Logger();
  watch = new Watch(this.kc);
  CR_NAME = 'servers.q3.magesgate.com';
  CR_GROUP = 'q3.magesgate.com';
  initedCr = false;
  constructor() {
    this.kc.loadFromDefault();
    this.k8sApi = this.kc.makeApiClient(CoreV1Api);
    this.q3K8sApi = this.kc.makeApiClient(CustomObjectsApi);
    this.k8sAppsApi = this.kc.makeApiClient(AppsV1Api);

    const currentNamespace = this.getNamespaceName();
    if (currentNamespace) this.namespace = currentNamespace;

    this.init();
  }

  setStatus(name: string, patch: Record<string, any>) {
    try {
      return this.q3K8sApi.patchNamespacedCustomObjectStatus(
        this.CR_GROUP,
        API_VERSION,
        this.namespace,
        'servers',
        name,
        patch,
        undefined,
        undefined,
        undefined,
        { headers: { 'Content-type': PatchUtils.PATCH_FORMAT_JSON_PATCH } },
      );
    } catch (e) {
      console.error(e.body);
      return null;
    }
  }

  async watcher(
    thisArg: any,
    cb: (type: string, obj: Record<string, any>) => void,
  ) {
    while (!this.initedCr) await new Promise((r) => setTimeout(r, 1000));
    this.watch.watch(
      `/apis/${this.CR_GROUP}/${API_VERSION}/namespaces/${this.namespace}/servers`,
      {},
      // funzione di callback per le modifiche
      (type, obj) => {
        // console.log(`Tipo di evento: ${type}, Oggetto modificato: `, obj);
        cb.call(thisArg, type, obj);
      },
      // funzione di callback per gli errori
      (err) => {
        console.error("Errore durante l'osservazione delle modifiche: ", err);
      },
    );
  }

  createQ3Deployment(deployment: Record<string, any>) {
    return this.k8sAppsApi.createNamespacedDeployment(
      this.namespace,
      deployment,
    );
  }

  async deleteQ3Deployment(name: string) {
    return await this.k8sAppsApi.deleteNamespacedDeployment(
      name,
      this.namespace,
    );
  }

  createQ3Service(service: Record<string, any>) {
    return this.k8sApi.createNamespacedService(this.namespace, service);
  }

  async deleteQ3Service(name: string) {
    return await this.k8sApi.deleteNamespacedService(name, this.namespace);
  }

  async getServers(): Promise<Record<string, any>> {
    const servers = await this.q3K8sApi.listNamespacedCustomObject(
      this.CR_GROUP,
      API_VERSION,
      this.namespace,
      'servers',
    );
    return servers.body;
  }
  async getServer(name: string): Promise<Record<string, any>> {
    const server = await this.q3K8sApi.getNamespacedCustomObject(
      this.CR_GROUP,
      API_VERSION,
      this.namespace,
      'servers',
      name,
    );
    //console.log(server);
    return server.body;
  }

  async createServer(server: CreateQ3ServerDto) {
    const serverResource = kubeQ3apiDefaultServer;
    serverResource.metadata.name = server.name;
    serverResource.spec.q3.map = server.map;
    let newServer;
    //console.log(serverResource);
    try {
      newServer = await this.q3K8sApi.createNamespacedCustomObject(
        this.CR_GROUP,
        API_VERSION,
        this.namespace,
        'servers',
        kubeQ3apiDefaultServer,
      );
    } catch (e) {
      console.error('Errore durante la creazione della Custom Resource: ', e);
      return e.body;
    }

    return newServer.body;
  }

  async deleteServer(serverName: string) {
    let oldServer;

    try {
      oldServer = await this.q3K8sApi.deleteNamespacedCustomObject(
        this.CR_GROUP,
        API_VERSION,
        this.namespace,
        'servers',
        serverName,
      );
    } catch (e) {
      console.error('Errore durante la creazione della Custom Resource: ', e);
      return e.body;
    }

    return oldServer.body;
  }

  async getNamespacePods() {
    return (await this.k8sApi.listNamespacedPod(this.namespace)).body;
  }

  getNamespaceName() {
    try {
      const namespace = fs.readFileSync(
        '/var/run/secrets/kubernetes.io/serviceaccount/namespace',
        { encoding: 'utf8' },
      );
      this.kubeLogger.log(`Il namespace è ${namespace}`);
      return namespace;
    } catch (e) {
      this.kubeLogger.warn('Errore nella lettura del namespace:', e);
    }
  }

  async getQ3customGroup(): Promise<Record<string, any>> {
    let q3api = null;
    try {
      q3api = await this.q3K8sApi.getClusterCustomObject(
        'apiextensions.k8s.io',
        'v1',
        'customresourcedefinitions',
        'servers.q3.magesgate.com',
      );
    } catch (e) {
      return null;
    }
    return q3api.body;
  }

  async init() {
    await this.createQ3CustomGroup();
    this.initedCr = true;
  }

  async createQ3CustomGroup() {
    try {
      const customResourceDefinitionManifest = q3ServerCrDefinitionManifest({
        name: this.CR_NAME,
        group: this.CR_GROUP,
      });
      const q3customGroup = await this.getQ3customGroup();
      if (!q3customGroup) {
        await this.q3K8sApi.createClusterCustomObject(
          'apiextensions.k8s.io',
          'v1',
          'customresourcedefinitions',
          customResourceDefinitionManifest,
        );
        return (await this.getQ3customGroup()).body;
      }
    } catch (e) {
      console.error('qui');
      console.error(e.body, e.stack);
    }
  }

  async getFreeNodePort(min = 30000, max = 32767): Promise<number | undefined> {
    const usedPorts = [];
    const services = await this.k8sApi.listServiceForAllNamespaces();
    services.body.items.forEach((service) => {
      service.spec.ports.forEach((port) => {
        // console.log(port);
        // Aggiungi le porte NodePort all'array
        if (port.nodePort) {
          usedPorts.push(port.nodePort);
        }
      });
    });
    const ports = Array.from({ length: max - min + 1 }, (v, k) => k + min);
    const availableNumbers = ports.filter((num) => !usedPorts.includes(num));
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    return availableNumbers[randomIndex];
  }

  async getServicesWithAppLabel(appLabelValue: string) {
    const res = await this.k8sApi.listNamespacedService(this.namespace);
    const services = res.body.items;

    // Filtra solo i servizi che hanno l'etichetta 'app' specificata nel selettore
    const filteredServices = services.filter(
      (service) =>
        service.spec.selector && service.spec.selector.app === appLabelValue,
    );

    return filteredServices;
  }

  async createConfigMapFromFile(
    configMapName: string,
    obj: { serverConf: string },
  ) {
    // Leggi il contenuto del file
    // Crea la ConfigMap
    const configMap = {
      metadata: {
        name: configMapName,
        namespace: this.namespace,
      },
      data: {
        // Il nome 'file' qui è l'eventuale nome del file quando la ConfigMap è montata in un container
        'server.cfg': obj.serverConf,
      },
    };

    try {
      await this.k8sApi.createNamespacedConfigMap(this.namespace, configMap);
    } catch (e) {
      console.error(e);
    }
  }

  async getConfigMap(configMapName: string): Promise<V1ConfigMap | null> {
    // Leggi il contenuto del file
    try {
      const cmap = (
        await this.k8sApi.readNamespacedConfigMap(configMapName, this.namespace)
      ).body;
      //console.log(cmap);

      return cmap;
    } catch (e) {
      return null;
    }
  }
  async deleteConfigMap(configMapName: string): Promise<V1ConfigMap | null> {
    // Leggi il contenuto del file
    try {
      return (
        await this.k8sApi.deleteNamespacedConfigMap(
          configMapName,
          this.namespace,
        )
      ).body;
    } catch (e) {
      return null;
    }
  }

  async getDeployment(deploymentName: string): Promise<V1ConfigMap | null> {
    // Leggi il contenuto del file
    try {
      return (
        await this.k8sAppsApi.readNamespacedDeployment(
          deploymentName,
          this.namespace,
        )
      ).body;
    } catch (e) {
      return null;
    }
  }
}

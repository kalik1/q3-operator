import { Mods } from '../../../kube-module/kube/templates/game-modes.enums';

const ServiceTypes = ['None', 'ClusterIP', 'NodePort', 'LoadBalancer'] as const;

export class Q3Server {
  metadata: {
    name: string;
  };
  spec: {
    q3: {
      mod: Mods;
      map: string;
      mapPool?: string[];
    };
    service: {
      type: (typeof ServiceTypes)[number];
      externaIp?: string;
      nodePort?: number;
    };
  };
  status: {
    state: string;
    message?: string;
    players?: string;
    serverStatus?: Record<string, any>;
  };
}

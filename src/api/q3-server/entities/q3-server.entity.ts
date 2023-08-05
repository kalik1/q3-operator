import { Mods } from '../../../kube-module/kube/templates/game-modes.enums';

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
  };
  status: {
    state: string;
    message?: string;
    players?: string;
  };
}

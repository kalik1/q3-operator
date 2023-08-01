import { API_VERSION } from '../../../const';

const kubeQ3apiDefaultServer = {
  apiVersion: `q3.magesgate.com/${API_VERSION}`,
  kind: 'Server',
  metadata: {
    name: 'new-server',
  },
  spec: {
    q3: {
      map: null,
    },
  },
  status: {
    state: 'new',
    message: 'Created',
  },
};
export { kubeQ3apiDefaultServer };

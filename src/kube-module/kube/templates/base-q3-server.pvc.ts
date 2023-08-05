import { V1PersistentVolumeClaim } from '@kubernetes/client-node/dist/gen/model/v1PersistentVolumeClaim';

function baseQ3ServerPvc(name: string, size: number): V1PersistentVolumeClaim {
  return {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: `${name}`,
    },
    spec: {
      accessModes: ['ReadWriteOnce'],
      resources: {
        requests: {
          storage: `${size}Mi`,
        },
      },
    },
  };
}

export { baseQ3ServerPvc };

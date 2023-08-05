import { V1PersistentVolumeClaim } from '@kubernetes/client-node/dist/gen/model/v1PersistentVolumeClaim';
import { V1Job } from '@kubernetes/client-node';
import { ModPacks, Mods } from './game-modes.enums';

type modPackType = typeof ModPacks;
function baseQ3ServerPakDownloadJob(
  name: string,
  volumeName: string,
  modPack: modPackType[Mods][number],
): V1Job {
  return {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: name,
    },
    spec: {
      template: {
        spec: {
          containers: [
            {
              name: 'download-container',
              image: 'appropriate/curl', // an image that includes curl
              command: [
                'sh',
                '-c',
                `curl -L -o /data/${modPack.fileName} ${modPack.uri}`,
              ],
              volumeMounts: [
                {
                  name: 'download-volume',
                  mountPath: '/data',
                },
              ],
            },
          ],
          restartPolicy: 'Never',
          volumes: [
            {
              name: 'download-volume',
              persistentVolumeClaim: {
                claimName: volumeName, // replace with your PVC name
              },
            },
          ],
        },
      },
      backoffLimit: 4,
    },
  };
}

export { baseQ3ServerPakDownloadJob };

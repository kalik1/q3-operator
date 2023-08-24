import { V1PersistentVolumeClaim } from '@kubernetes/client-node/dist/gen/model/v1PersistentVolumeClaim';
import { V1Job } from '@kubernetes/client-node';
import { ModPacks, Mods } from './game-modes.enums';

type modPackType = typeof ModPacks;
function baseQ3ServerPakDownloadJob(
  name: string,
  volumeName: string,
  data: { name: string; fileName: string; uri: string },
): V1Job {
  return {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: name,
      labels: {
        packName: data.name,
      },
    },
    spec: {
      template: {
        spec: {
          containers: [
            {
              name: 'download-container',
              image: 'alpine', // an image that includes curl
              command: [
                'sh',
                '-c',
                `apk --no-cache add curl tar gzip && 
                curl -L -o /data/${data.fileName} ${data.uri}  &&
                case "/data/${data.fileName}" in
                  *.zip) unzip /data/${data.fileName} -d /data ;;
                  *.tar) tar -xf /data/${data.fileName} -C /data ;;
                  *.tar.gz) tar -zxf /data/${data.fileName} -C /data ;;
                  # Add more cases here if needed
                  *) echo "File not Compressed, leaving as is" ;;
                esac`,
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

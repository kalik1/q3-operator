import { V1Deployment } from '@kubernetes/client-node';
import { Q3mod } from '../../../api/q3mod/entities/q3mod.entity';
import { posix as path } from 'path';

function baseQ3ServerDeployment(
  name: string,
  o: { confMapName: string },
  mod: Q3mod,
): V1Deployment {
  const deployment: V1Deployment = {
    apiVersion: `apps/v1`,
    kind: 'Deployment',
    metadata: {
      name: `${name}`, // nome unico per ogni deployment
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: `${name}`, // etichetta unica per ogni deployment
        },
      },
      template: {
        metadata: {
          labels: {
            app: `${name}`,
          },
        },
        spec: {
          volumes: [
            {
              name: 'config-volume',
              configMap: {
                name: o.confMapName,
              },
            },
            {
              name: 'q3-temp-data',
              emptyDir: {},
            },
          ],
          initContainers: [],
          containers: [
            {
              name: 'quake3-server',
              image: 'inanimate/quake3:latest',
              args: ['+set', 'dedicated', '1'],
              ports: [
                {
                  containerPort: 27960,
                  protocol: 'UDP',
                },
              ],
              volumeMounts: [
                {
                  name: 'config-volume',
                  mountPath: '/usr/share/games/quake3/baseq3/server.cfg',
                  subPath: 'server.cfg',
                },
                {
                  name: 'q3-temp-data',
                  mountPath: '/var/games/quake3-server/.q3a',
                },
              ],
            },
          ],
        },
      },
    },
  };
  mod.spec.datapacks.forEach((dp) => {
    deployment.spec.template.spec.volumes.push({
      name: `datapack-source-${dp.name}-data`,
      persistentVolumeClaim: { claimName: dp.name },
    });
    deployment.spec.template.spec.volumes.push({
      name: `datapack-${dp.name}-data`,
      emptyDir: {},
    });
    deployment.spec.template.spec.initContainers.push({
      name: `mod-${dp.name}`,
      image: 'alpine',
      command: ['sh', '-c', 'cp -R /data/* /datapack/'],
      volumeMounts: [
        {
          name: `datapack-source-${dp.name}-data`,
          mountPath: '/data',
        },
        {
          name: `datapack-${dp.name}-data`,
          mountPath: '/datapack',
        },
      ],
    });
    const containerIdx = deployment.spec.template.spec.containers.findIndex(
      (c) => (c.name = 'quake3-server'),
    );

    let mountPath: string;
    let fileName: string = path.basename(dp.fileName);
    if (dp.isFolder) {
      fileName = removeExtension(fileName);
      mountPath = path.join(
        '/usr/share/games/quake3/',
        dp.destPath || fileName,
      );
    } else {
      mountPath = path.join('/usr/share/games/quake3/', dp.destPath, fileName);
    }
    const subPath = dp.subPath || fileName;

    const volumeMount: V1Deployment['spec']['template']['spec']['containers'][number]['volumeMounts'][number] =
      {
        name: `datapack-${dp.name}-data`,
        mountPath,
        subPath,
      };

    deployment.spec.template.spec.containers[containerIdx].volumeMounts.push(
      volumeMount,
    );
    if (mod.spec.args) {
      deployment.spec.template.spec.containers[containerIdx].args = [
        ...deployment.spec.template.spec.containers[containerIdx].args,
        ...mod.spec.args,
      ];
    }
  });

  return deployment;
}

function removeExtension(filename: string) {
  const lastDot = filename.lastIndexOf('.');

  if (lastDot === -1) return filename;

  return filename.slice(0, lastDot);
}

export { baseQ3ServerDeployment };

function baseQ3ServerDeployment(name: string, o: { confMapName: string }) {
  return {
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
              name: 'datapack-data',
              emptyDir: {},
            },
            {
              name: 'config-volume',
              configMap: {
                name: o.confMapName,
              },
            },
          ],
          initContainers: [
            {
              name: 'download-file',
              image: 'appropriate/curl',
              command: [
                'sh',
                '-c',
                'curl -o /datapack/pak0.pk3 https://raw.githubusercontent.com/nrempel/q3-server/master/baseq3/pak0.pk3',
              ],
              volumeMounts: [
                {
                  name: 'datapack-data',
                  mountPath: '/datapack',
                },
              ],
            },
          ],
          containers: [
            {
              name: 'quake3-server',
              image: 'inanimate/quake3:latest',
              ports: [
                {
                  containerPort: 27960,
                  protocol: 'UDP',
                },
              ],
              volumeMounts: [
                {
                  name: 'datapack-data',
                  mountPath: '/usr/share/games/quake3/baseq3/pak0.pk3',
                  subPath: 'pak0.pk3',
                },
                {
                  name: 'config-volume',
                  mountPath: '/usr/share/games/quake3/baseq3/server.cfg',
                  subPath: 'server.cfg',
                },
              ],
            },
          ],
        },
      },
    },
  };
}

export { baseQ3ServerDeployment };

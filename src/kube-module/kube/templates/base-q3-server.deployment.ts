function baseQ3ServerDeployment(name: string, o: { confMapName: string }) {
  return {
    apiVersion: 'apps/v1',
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
            app: `${name}`, // etichetta unica per ogni pod
          },
        },
        spec: {
          volumes: [
            {
              name: 'datapack-data', // il nome del volume che conterrà il file scaricato
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
              image: 'appropriate/curl', // un'immagine che contiene curl o un altro strumento di download
              command: [
                'sh',
                '-c',
                'curl -o /datapack/pak0.pk3 https://raw.githubusercontent.com/nrempel/q3-server/master/baseq3/pak0.pk3', // sostituisci con il tuo URL del file
              ],
              volumeMounts: [
                {
                  name: 'datapack-data', // corrisponde al nome del volume definito sopra
                  mountPath: '/datapack', // il percorso in cui il volume sarà montato nell'initContainer
                },
              ],
            },
          ],
          containers: [
            {
              name: 'quake3-server',
              image: 'inanimate/quake3:latest', // sostituisci con il nome della tua immagine Docker
              ports: [
                {
                  containerPort: 27960, // porta su cui il server Quake3 accetta connessioni
                  protocol: 'UDP', // porta su cui il server Quake3 accetta connessioni
                },
              ],
              volumeMounts: [
                {
                  name: 'datapack-data', // corrisponde al nome del volume definito sopra
                  mountPath: '/usr/share/games/quake3/baseq3/pak0.pk3', // il percorso in cui il volume sarà montato nel container principale
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

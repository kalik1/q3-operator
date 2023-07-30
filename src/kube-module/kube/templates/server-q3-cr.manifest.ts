function q3ServerCrDefinitionManifest(data: { name: string; group: string }) {
  return {
    apiVersion: 'apiextensions.k8s.io/v1',
    kind: 'CustomResourceDefinition',
    metadata: {
      name: data.name, // sostituisci con il tuo valore
    },
    spec: {
      group: data.group, // sostituisci con il tuo valore
      versions: [
        {
          name: 'v1',
          served: true,
          storage: true,
          schema: {
            openAPIV3Schema: {
              type: 'object',
              properties: {
                spec: {
                  type: 'object',
                  properties: {
                    q3: {
                      type: 'object',
                      properties: {
                        map: {
                          type: 'string',
                          description: 'Map Name',
                        },
                        mapPool: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                          description: 'Map Pool',
                        },
                      },
                      required: ['map'],
                    },
                    network: {
                      type: 'object',
                      properties: {
                        nodeport: {
                          type: 'string',
                          description: 'Map Name',
                        },
                      },
                    },
                  },
                },
                status: {
                  type: 'object',
                  properties: {
                    state: {
                      type: 'string',
                      description: 'Server State',
                      default: 'Created',
                    },
                    players: {
                      type: 'string',
                      description: 'Players number',
                    },
                    message: {
                      type: 'string',
                      description: 'Server Message',
                    },
                  },
                  required: ['state'],
                },
              },
            },
          },
          subresources: {
            status: {},
          },
        },
      ],
      scope: 'Namespaced', // o 'Cluster' se la tua risorsa non è legata a un namespace specifico
      names: {
        plural: 'servers', // il plurale del tuo 'kind'
        singular: 'server', // il singolare del tuo 'kind'
        kind: 'Server', // la versione CamelCase del tuo 'kind'
      },
    },
  };
}
export { q3ServerCrDefinitionManifest };

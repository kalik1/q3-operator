import { API_VERSION } from '../../../const';
import { Mods } from './game-modes.enums';

function q3ServerCrDefinitionManifest(data: { name: string; group: string }) {
  return {
    apiVersion: 'apiextensions.k8s.io/v1',
    kind: 'CustomResourceDefinition',
    metadata: {
      name: data.name,
    },
    spec: {
      group: data.group,
      versions: [
        {
          name: API_VERSION,
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
                        mod: {
                          type: 'string',
                          description: 'Game Mods',
                          default: Mods.Base,
                          enum: Object.values(Mods),
                        },
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
                      required: ['map', 'mod'],
                    },
                    network: {
                      type: 'object',
                      properties: {
                        nodeport: {
                          type: 'string',
                          description: 'NetworkType',
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
      scope: 'Namespaced',
      names: {
        plural: 'servers',
        singular: 'server',
        kind: 'Server',
      },
    },
  };
}
export { q3ServerCrDefinitionManifest };

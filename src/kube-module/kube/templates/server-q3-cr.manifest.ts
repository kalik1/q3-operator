import { API_VERSION } from '../../../const';
import { Mods } from './game-modes.enums';

function q3ServerCrDefinitionManifest() {
  return {
    apiVersion: 'apiextensions.k8s.io/v1',
    kind: 'CustomResourceDefinition',
    metadata: {
      name: 'servers.q3.magesgate.com',
    },
    spec: {
      group: 'q3.magesgate.com',
      versions: [
        {
          additionalPrinterColumns: [
            {
              jsonPath: '.spec.q3.mod',
              name: 'Mod',
              type: 'string',
            },
          ],
          name: API_VERSION,
          served: true,
          storage: true,
          schema: {
            openAPIV3Schema: {
              description: 'Schema for the Quake3 Servers API',
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
                          default: 'base',
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
                    externalIp: {
                      type: 'string',
                      description: 'Server Exposed IP',
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
console.log(JSON.stringify(q3ServerCrDefinitionManifest()));

export { q3ServerCrDefinitionManifest };

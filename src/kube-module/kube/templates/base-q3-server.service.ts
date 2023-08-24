function baseQ3ServerService(name: string, port: number) {
  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: `${name}-service`,
    },
    spec: {
      type: 'LoadBalancer',
      selector: {
        app: name,
      },
      ports: [
        {
          protocol: 'UDP',
          port: port,
          targetPort: 27960,
        },
      ],
    },
  };
}

export { baseQ3ServerService };

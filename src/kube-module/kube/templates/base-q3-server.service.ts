function baseQ3ServerService(name: string, port: number) {
  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: `${name}-service`, // nome del servizio
    },
    spec: {
      type: 'LoadBalancer', // tipo di servizio
      selector: {
        app: name, // etichetta del deployment da esporre
      },
      ports: [
        {
          protocol: 'UDP',
          nodePort: port, // porta mappata sul nodo
          port: port, // port, // porta a cui il servizio risponde
          targetPort: 27960, // porta del container a cui indirizzare il traffico
        },
      ],
    },
  };
}

export { baseQ3ServerService };

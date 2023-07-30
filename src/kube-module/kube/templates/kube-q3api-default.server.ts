const kubeQ3apiDefaultServer = {
  apiVersion: 'q3.magesgate.com/v1',
  kind: 'Server',
  metadata: {
    name: 'new-server',
  },
  spec: {
    q3: {
      map: null,
    },
  },
  status: {
    state: 'new', // sostituisci con il tuo stato
    message: 'Created', // sostituisci con il tuo messaggio
  },
};
export { kubeQ3apiDefaultServer };

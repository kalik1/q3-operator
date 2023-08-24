import * as Q3RCon from 'quake3-rcon';

export class Q3ServerRcon {
  q3rcon: Q3RCon;
  q3Config: Parameters<typeof Q3RCon>;
  connected = false;

  constructor(config: Parameters<typeof Q3RCon>) {
    this.q3Config = config;
    this.connect();
  }

  async serverInfo() {
    if (this.connected) {
      const serverInfo = await new Promise(
        (resolve: (r: string) => void, reject: (r: string) => void) => {
          try {
            this.q3rcon.send('serverinfo', (response: string) =>
              resolve(response),
            );
          } catch (e) {
            reject(e);
          }
        },
      );
      return this.parseServerInfo(serverInfo);
    } else {
      console.error('Rcon not connected');
    }
  }

  private connect() {
    if (!this.connected) {
      try {
        this.q3rcon = new Q3RCon(this.q3Config);
        this.connected = true;
      } catch (e) {
        console.error('Error connecting');
      }
    }
  }

  private parseServerInfo(input: string): { [key: string]: string } {
    const lines = input.split('\n');
    const result: { [key: string]: string } = {};

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length === 2) {
        const [key, value] = parts;
        result[key] = value;
      }
    }

    return result;
  }
}

import { DatapackStatus } from '../q3mod-status.enum';

export class Q3mod {
  metadata: {
    name: string;
  };
  spec: {
    datapacks: {
      name: string;
      fileName: string;
      destPath?: string;
      subPath?: string;
      isFolder?: boolean;
      uri: string;
    }[];
    args: string[];
  };
  status: {
    datapacks: {
      name: string;
      status: DatapackStatus;
      job?: string;
      message?: string;
    }[];
  };
}

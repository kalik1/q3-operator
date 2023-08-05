import { Routes } from '@nestjs/core';
import { Q3ServerModule } from './q3-server/q3-server.module';

const apiRoutes: Routes = [
  {
    path: 'q3-server',
    module: Q3ServerModule,
  },
];

export { apiRoutes };

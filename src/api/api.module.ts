import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { apiRoutes } from './api.routes';
import { Q3ServerModule } from './q3-server/q3-server.module';
import { HttpModule } from '@nestjs/axios';
import { Q3modModule } from './q3mod/q3mod.module';

@Module({
  imports: [Q3ServerModule, RouterModule.register(apiRoutes), Q3modModule],
  controllers: [],
})
export class ApiModule {}

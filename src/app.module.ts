import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SwaggerModule } from '@nestjs/swagger';
import { Q3ServerModule } from './q3-server/q3-server.module';
import { KubeModule } from './kube-module/kube.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SwaggerModule,
    Q3ServerModule,
    ConfigModule.forRoot(),
    KubeModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

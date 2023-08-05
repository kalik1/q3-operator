import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Q3ServerService } from './q3-server.service';
import { CreateQ3ServerDto } from './dto/create-q3-server.dto';
import { UpdateQ3ServerDto } from './dto/update-q3-server.dto';
import { ApiTags } from '@nestjs/swagger';
import { KubeService } from '../../kube-module/kube/kube.service';
import * as process from 'process';

@Controller()
@ApiTags('Q3 Server')
export class Q3ServerController {
  constructor(
    private readonly q3ServerService: Q3ServerService,
    private readonly kubeService: KubeService,
  ) {}

  @Post()
  create(@Body() createQ3ServerDto: CreateQ3ServerDto) {
    return this.q3ServerService.create(createQ3ServerDto);
  }

  @Get()
  findAll() {
    return this.q3ServerService.findAll();
  }

  @Get('pods')
  async listNamespacedPod() {
    return this.kubeService.getNamespacePods();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.q3ServerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQ3ServerDto: UpdateQ3ServerDto,
  ) {
    return this.q3ServerService.update(+id, updateQ3ServerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.q3ServerService.remove(id);
  }
}

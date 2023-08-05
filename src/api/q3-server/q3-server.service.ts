import { Injectable } from '@nestjs/common';
import { CreateQ3ServerDto } from './dto/create-q3-server.dto';
import { UpdateQ3ServerDto } from './dto/update-q3-server.dto';
import { KubeService } from '../../kube-module/kube/kube.service';

@Injectable()
export class Q3ServerService {
  constructor(private readonly kubeService: KubeService) {}
  async create(createQ3ServerDto: CreateQ3ServerDto) {
    if (!createQ3ServerDto.name)
      createQ3ServerDto.name = `server-${Date.now()}`;
    return this.kubeService.createServer(createQ3ServerDto);
  }

  async findAll() {
    return (await this.kubeService.getServers()).items;
  }

  async findOne(name: string) {
    return await this.kubeService.getServer(name);
  }

  update(id: number, updateQ3ServerDto: UpdateQ3ServerDto) {
    return `This action updates a #${id} q3Server`;
  }

  remove(id: string) {
    return this.kubeService.deleteServer(id);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { KubeService } from './kube.service';

describe('KubeService', () => {
  let service: KubeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KubeService],
    }).compile();

    service = module.get<KubeService>(KubeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

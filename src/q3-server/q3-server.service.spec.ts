import { Test, TestingModule } from '@nestjs/testing';
import { Q3ServerService } from './q3-server.service';

describe('Q3ServerService', () => {
  let service: Q3ServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Q3ServerService],
    }).compile();

    service = module.get<Q3ServerService>(Q3ServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

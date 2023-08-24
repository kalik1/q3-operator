import { Test, TestingModule } from '@nestjs/testing';
import { Q3modService } from './q3mod.service';

describe('Q3modService', () => {
  let service: Q3modService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Q3modService],
    }).compile();

    service = module.get<Q3modService>(Q3modService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

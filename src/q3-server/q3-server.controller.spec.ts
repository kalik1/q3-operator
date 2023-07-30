import { Test, TestingModule } from '@nestjs/testing';
import { Q3ServerController } from './q3-server.controller';
import { Q3ServerService } from './q3-server.service';

describe('Q3ServerController', () => {
  let controller: Q3ServerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Q3ServerController],
      providers: [Q3ServerService],
    }).compile();

    controller = module.get<Q3ServerController>(Q3ServerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

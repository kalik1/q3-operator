import { Test, TestingModule } from '@nestjs/testing';
import { Q3modController } from './q3mod.controller';
import { Q3modService } from './q3mod.service';

describe('Q3modController', () => {
  let controller: Q3modController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Q3modController],
      providers: [Q3modService],
    }).compile();

    controller = module.get<Q3modController>(Q3modController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

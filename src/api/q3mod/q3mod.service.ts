import { Injectable } from '@nestjs/common';
import { CreateQ3modDto } from './dto/create-q3mod.dto';
import { UpdateQ3modDto } from './dto/update-q3mod.dto';

@Injectable()
export class Q3modService {
  create(createQ3modDto: CreateQ3modDto) {
    return 'This action adds a new q3mod';
  }

  findAll() {
    return `This action returns all q3mod`;
  }

  findOne(id: number) {
    return `This action returns a #${id} q3mod`;
  }

  update(id: number, updateQ3modDto: UpdateQ3modDto) {
    return `This action updates a #${id} q3mod`;
  }

  remove(id: number) {
    return `This action removes a #${id} q3mod`;
  }
}

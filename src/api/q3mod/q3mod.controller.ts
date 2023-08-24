import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Q3modService } from './q3mod.service';
import { CreateQ3modDto } from './dto/create-q3mod.dto';
import { UpdateQ3modDto } from './dto/update-q3mod.dto';

@Controller('q3mod')
export class Q3modController {
  constructor(private readonly q3modService: Q3modService) {}

  @Post()
  create(@Body() createQ3modDto: CreateQ3modDto) {
    return this.q3modService.create(createQ3modDto);
  }

  @Get()
  findAll() {
    return this.q3modService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.q3modService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQ3modDto: UpdateQ3modDto) {
    return this.q3modService.update(+id, updateQ3modDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.q3modService.remove(+id);
  }
}

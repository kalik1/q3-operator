import { PartialType } from '@nestjs/swagger';
import { CreateQ3modDto } from './create-q3mod.dto';

export class UpdateQ3modDto extends PartialType(CreateQ3modDto) {}

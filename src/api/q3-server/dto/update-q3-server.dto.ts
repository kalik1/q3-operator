import { PartialType } from '@nestjs/swagger';
import { CreateQ3ServerDto } from './create-q3-server.dto';

export class UpdateQ3ServerDto extends PartialType(CreateQ3ServerDto) {}

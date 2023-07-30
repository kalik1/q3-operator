import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQ3ServerDto {
  @ApiPropertyOptional({ type: 'string', default: 'server' })
  name?: string;

  @ApiProperty({ type: 'string', default: 'q3dm6' })
  map: string;
}

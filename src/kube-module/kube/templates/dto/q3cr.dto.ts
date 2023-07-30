import { ApiProperty } from '@nestjs/swagger';

export class Q3ServerSpec {
  @ApiProperty({ type: 'string' })
  map: string;

  @ApiProperty({ type: 'string' })
  mapPool: string;
}

export class ServerSpec {
  @ApiProperty({ type: Q3ServerSpec })
  q3: Q3ServerSpec;
}
export class ServerStatus {
  @ApiProperty({ type: 'string' })
  state: string;

  @ApiProperty({ type: 'string' })
  message: string;
}
export class Q3crDto {
  @ApiProperty({ type: ServerSpec })
  spec: ServerSpec;
}

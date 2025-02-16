import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'John Doe', description: 'The updated name of the user', required: false })
  name?: string;

  @ApiProperty({ example: 'john.new@example.com', description: 'The updated email of the user', required: false })
  email?: string;

  @ApiProperty({ example: 'newsecurepassword', description: 'The updated password of the user', required: false })
  password?: string;
}

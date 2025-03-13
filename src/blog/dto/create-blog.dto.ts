/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: 'My First Blog', description: 'Title of the blog' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Image URL of the blog' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'This is the content of my first blog.', description: 'Content of the blog' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiProperty({ example: 'Updated Blog Title', description: 'Updated title of the blog', required: false })
  title?: string;

  @ApiProperty({ example: 'https://example.com/new-image.jpg', description: 'Updated image URL', required: false })
  image?: string;

  @ApiProperty({ example: 'Updated content of the blog.', description: 'Updated content', required: false })
  content?: string;
}

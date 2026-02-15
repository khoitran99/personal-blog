import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class CreateBlogDto {
  @ApiProperty({
    example: 'My First Blog Post',
    description: 'The title of the blog post',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is the content...',
    description: 'The content of the blog post in Markdown',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL of the cover image',
    required: false,
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({
    example: ['tech', 'nestjs'],
    description: 'List of tags',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    enum: BlogStatus,
    description: 'Status of the blog post',
    required: false,
  })
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}

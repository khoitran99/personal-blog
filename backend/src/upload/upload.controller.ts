import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('upload')
@UseGuards(AdminGuard)
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('presigned-url')
  async getPresignedUrl(@Body('contentType') contentType: string) {
    return this.s3Service.getPresignedUrl(contentType);
  }
}

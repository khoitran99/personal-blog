import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'ap-southeast-1',
    });
  }

  async getPresignedUrl(contentType: string) {
    if (!this.bucketName) {
      throw new InternalServerErrorException(
        'AWS_S3_BUCKET_NAME not configured',
      );
    }

    const key = `uploads/${uuidv4()}-${Date.now()}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    try {
      const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
      return {
        url,
        key,
        publicUrl: `https://${this.bucketName}.s3.amazonaws.com/${key}`,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Could not generate presigned URL',
      );
    }
  }
}

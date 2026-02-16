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
      // Prevent automatic checksum generation which invalidates presigned URLs for unknown bodies
      requestChecksumCalculation: 'WHEN_REQUIRED',
    });
  }

  async getPresignedUrl(contentType: string) {
    if (!this.bucketName) {
      // Local fallback logic would go here if enabled
      throw new InternalServerErrorException(
        'AWS_S3_BUCKET_NAME not configured',
      );
    }

    // Default to binary if contentType is missing/empty
    const validContentType = contentType || 'application/octet-stream';

    const key = `uploads/${uuidv4()}-${Date.now()}`;
    // Explicitly do not set ChecksumAlgorithm to avoid presigning a checksum
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: validContentType,
      // Force checksum undefined for absolute clarity (though it's default)
      ChecksumAlgorithm: undefined,
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

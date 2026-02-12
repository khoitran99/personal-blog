import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDBService {
  public readonly client: DynamoDBDocumentClient;
  private readonly rawClient: DynamoDBClient;

  constructor() {
    this.rawClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'ap-southeast-1',
    });
    this.client = DynamoDBDocumentClient.from(this.rawClient);
  }
}

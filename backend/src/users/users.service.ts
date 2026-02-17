import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../dynamodb/dynamodb.service';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly tableName = 'Users';

  constructor(private readonly db: DynamoDBService) {}

  async findOne(email: string): Promise<User | undefined> {
    const result = await this.db.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
        Limit: 1,
      }),
    );
    return result.Items?.[0] as User;
  }

  async create(user: User): Promise<User> {
    await this.db.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: user,
      }),
    );
    return user;
  }
}

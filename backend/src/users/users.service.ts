import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../dynamodb/dynamodb.service';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly tableName = 'Users';

  constructor(private readonly db: DynamoDBService) {}

  async findOne(email: string): Promise<User | undefined> {
    const result = await this.db.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { email },
      }),
    );
    return result.Item as User;
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

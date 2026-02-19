import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto, BlogStatus } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { DynamoDBService } from '../dynamodb/dynamodb.service';
import {
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BlogService {
  private readonly tableName = process.env.BLOG_TABLE_NAME || 'Blogs';

  constructor(private readonly db: DynamoDBService) {}

  async create(createBlogDto: CreateBlogDto) {
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    const newBlog = {
      id,
      ...createBlogDto,
      status: createBlogDto.status || BlogStatus.DRAFT,
      tags: createBlogDto.tags || [],
      views: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      await this.db.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: newBlog,
        }),
      );
      return newBlog;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create blog post');
    }
  }

  async findAll() {
    try {
      const result = await this.db.client.send(
        new ScanCommand({
          TableName: this.tableName,
        }),
      );
      return result.Items || [];
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not fetch blogs');
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.db.client.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { id },
        }),
      );

      if (!result.Item) {
        throw new NotFoundException(`Blog with ID ${id} not found`);
      }

      const blog = result.Item as unknown as Blog;

      return {
        ...blog,
        views: blog.views || 0,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Could not fetch blog');
    }
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    // Ideally we should construct generic update expression
    // For simplicity, we fetch, merge, and put (since users are owner only, low contention)
    // Or we use UpdateCommand but that requires dynamic expression building.
    // Let's use fetch+merge+put for simplicity unless partial update is critical.
    // Actually, UpdateCommand is better practice. Let's do a simple dynamic builder.

    // Check existence
    await this.findOne(id);

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {
      '#updatedAt': 'updatedAt',
    };
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': new Date().toISOString(),
    };

    Object.keys(updateBlogDto).forEach((key) => {
      const typedKey = key as keyof UpdateBlogDto;
      if (updateBlogDto[typedKey] !== undefined) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateBlogDto[typedKey];
      }
    });

    updateExpressions.push('#updatedAt = :updatedAt');

    try {
      await this.db.client.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { id },
          UpdateExpression: `SET ${updateExpressions.join(', ')}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        }),
      );
      return this.findOne(id); // Return full object
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not update blog');
    }
  }

  async remove(id: string) {
    try {
      await this.db.client.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { id },
        }),
      );
      return { deleted: true };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not delete blog');
    }
  }

  async incrementView(id: string) {
    try {
      await this.db.client.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { id },
          UpdateExpression: 'SET #views = if_not_exists(#views, :start) + :inc',
          ExpressionAttributeNames: { '#views': 'views' },
          ExpressionAttributeValues: { ':inc': 1, ':start': 0 },
        }),
      );
    } catch (error) {
      console.error('Failed to increment view count', error);
      // We can throw or silently fail. Given it's analytics, silent fail might be better
      // but usually we want to know if DB is down.
      // Nevertheless, let's just log for now as per previous logic.
    }
  }
}

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcrypt');

const clientConfig = {
  region: process.env.AWS_REGION || 'ap-southeast-1',
};

if (process.env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
}

// Only forcefully set local credentials if we are targeting localhost
// Otherwise, let the AWS SDK Resolve credentials automatically (Environment, Profile, etc.)
if (process.env.DYNAMODB_ENDPOINT && process.env.DYNAMODB_ENDPOINT.includes('localhost')) {
  clientConfig.credentials = {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  };
}

const client = new DynamoDBClient(clientConfig);

const docClient = DynamoDBDocumentClient.from(client);

const { randomUUID } = require('crypto');

async function seedAdmin() {
  const email = 'admin@example.com';
  const password = 'admin123';
  const name = 'Admin User';

  console.log(`Seeding admin user: ${email}`);

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const user = {
    id: randomUUID(),
    email,
    passwordHash,
    name,
    createdAt: new Date().toISOString(),
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: process.env.USERS_TABLE_NAME || 'Users',
        Item: user,
      }),
    );
    console.log('Admin user seeded successfully!');
  } catch (err) {
    console.error('Error seeding admin user:', err);
  }
}

seedAdmin();

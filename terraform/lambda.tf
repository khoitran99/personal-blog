data "archive_file" "backend_zip" {
  type        = "zip"
  source_dir  = "../backend/dist" # Assuming user runs build first and we copy node_modules or bundle
  output_path = "../backend.zip"
  # Note: Real-world scenario needs handling node_modules. 
  # For this demo, we assume the user bundles everything or layers are used.
  excludes = ["**/*.ts", "*.json"]
}

resource "aws_lambda_function" "api_lambda" {
  filename         = "../backend.zip" # Placeholder for actual artifact
  function_name    = "blog-platform-api"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "dist/lambda.handler" # Check build output structure
  source_code_hash = fileexists("../backend.zip") ? filebase64sha256("../backend.zip") : null
  runtime          = "nodejs18.x"
  timeout          = 10
  memory_size      = 512

  environment {
    variables = {
      BLOG_TABLE_NAME    = aws_dynamodb_table.blogs_table.name
      AWS_S3_BUCKET_NAME = aws_s3_bucket.uploads_bucket.id
      ADMIN_SECRET       = "change_me_in_prod"
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamodb_s3" {
  name = "lambda_dynamodb_s3"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Resource = aws_dynamodb_table.blogs_table.arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:PutObjectAcl"
        ]
        Resource = "${aws_s3_bucket.uploads_bucket.arn}/*"
      }
    ]
  })
}

output "api_endpoint" {
  description = "API Gateway Endpoint URL"
  value       = aws_apigatewayv2_api.lambda_api.api_endpoint
}

output "frontend_url" {
  description = "CloudFront URL for the frontend"
  value       = "https://${aws_cloudfront_distribution.frontend_distribution.domain_name}"
}

output "s3_frontend_bucket" {
  value = aws_s3_bucket.frontend_bucket.id
}

output "s3_uploads_bucket" {
  value = aws_s3_bucket.uploads_bucket.id
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.blogs_table.name
}

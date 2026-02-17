resource "aws_dynamodb_table" "blogs_table" {
  name         = "Blogs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Project = "blog-platform"
  }
}

resource "aws_dynamodb_table" "users_table" {
  name         = "Users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Project = "blog-platform"
  }
}

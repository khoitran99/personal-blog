# Personal Blog Platform

> A Serverless Full-Stack Blog Platform built with React, NestJS, and AWS.

## 📖 Project Overview

This repository houses the source code for a personal blog platform designed to be scalable, cost-effective, and easy to maintain. It leverages a modern Serverless architecture on AWS.

### Tech Stack

| Component    | Technology      | Details                                                                              |
| ------------ | --------------- | ------------------------------------------------------------------------------------ |
| **Frontend** | React 19 + Vite | Typescript, TailwindCSS v4, Framer Motion. Hosted on S3 + CloudFront.                |
| **Backend**  | NestJS          | NodeJS runtime, wrapped in `serverless-express`. hosted on AWS Lambda + API Gateway. |
| **Database** | DynamoDB        | NoSQL database for flexible content storage.                                         |
| **Infra**    | Terraform       | Infrastructure as Code (IaC) for AWS resources.                                      |
| **CI/CD**    | GitHub Actions  | Automated build and deployment pipelines.                                            |

---

## ✨ Functionalities

### Public Features

- **Blog Listing**: View a list of published blog posts.
- **Blog Detail**: Read individual blog posts rendered from Markdown.
- **Responsive Design**: optimized for mobile and desktop.

### Admin Features

- **Secure Authentication**: Secret-key based login for admin access.
- **Markdown Editor**: Create and edit posts with a rich editor.
- **Status Management**: Save posts as `DRAFT` or publish them as `PUBLISHED`.
- **Image Upload**: Upload images directly to S3.

---

## 🏗️ Architecture

### System Architecture

```mermaid
graph TD
    User((User))

    subgraph "AWS Cloud"
        CF[CloudFront CDN]
        S3Web[S3 Bucket (Frontend)]
        APIGW[API Gateway]
        Lambda[Lambda Function (NestJS)]
        DDB[(DynamoDB)]
        S3Media[S3 Bucket (Uploads)]
    end

    User -->|HTTPS| CF
    CF --> S3Web
    User -->|API Calls| APIGW
    APIGW --> Lambda
    Lambda --> DDB
    Lambda --> S3Media
```

### Publishing Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant API as API Gateway/Lambda
    participant DB as DynamoDB
    participant S3 as S3 Bucket

    Admin->>Frontend: Writes Blog Post
    Frontend->>API: POST /blogs (Content + status=PUBLISHED)
    API->>API: Validate Admin Secret
    API->>DB: Save Blog Record
    DB-->>API: Success
    API-->>Frontend: 201 Created
    Frontend-->>Admin: Show Success Message
```

---

## 🚀 Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [AWS CLI](https://aws.amazon.com/cli/) configured with your credentials.
- [Terraform](https://www.terraform.io/) installed.

### 1. Backend Setup

```bash
cd backend
npm install

# Create a .env file
echo "ADMIN_SECRET=your_secret_key" > .env
echo "AWS_REGION=ap-southeast-1" >> .env
# Add other necessary env vars

# Run locally in development mode
npm run start:dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create a .env file
echo "VITE_API_URL=http://localhost:3000" > .env

# Run locally
npm run dev
```

### 3. Infrastructure Setup (Terraform)

```bash
cd terraform

# Initialize Terraform
terraform init

# Review changes
terraform plan

# Apply changes (deploys resources to AWS)
terraform apply
```

---

## 📦 Deployment

This repository uses **GitHub Actions** for automated deployments.

### Workflow

The deployment is split based on the directory changed:

1. **Frontend Changes** (`frontend/**`):
   - Builds the Vite app.
   - Syncs `dist/` folder to the S3 bucket.
   - Invalidates CloudFront cache.

2. **Backend Changes** (`backend/**`):
   - Builds the NestJS app.
   - Zips the artifact.
   - Updates the AWS Lambda function code.

### Required GitHub Secrets

To enable deployment, configure these secrets in your repository settings:

- `AWS_ACCESS_KEY_ID`: IAM User with permissions for S3, Lambda, and CloudFront.
- `AWS_SECRET_ACCESS_KEY`: Secret key for the IAM user.
- `AWS_REGION`: Target AWS Region (e.g., `ap-southeast-1`).
- `BACKEND_FUNCTION_NAME`: Name of the Lambda function (from Terraform output).
- `FRONTEND_BUCKET_NAME`: Name of the S3 bucket for frontend (from Terraform output).
- `CLOUDFRONT_DISTRIBUTION_ID`: ID of the CloudFront distribution.

---

## 👩‍💻 New Developer Guide

Welcome to the team! Here is how to start your Day 1:

1. **Clone the repo**: `git clone <repo-url>`
2. **Check the Infra**: Ask a team member for the `terraform.tfstate` location or ensure you have access to the remote state. If starting fresh, run `terraform apply` in the `terraform/` directory to create your own dev environment.
3. **Configure Local Env**:
   - Get the API Gateway URL from Terraform outputs (`terraform output api_endpoint`).
   - Set `VITE_API_URL` in `frontend/.env` to that URL (or your local backend URL).
4. **Start Coding**:
   - Run `npm run dev` in `frontend/` to work on UI.
   - Run `npm run start:dev` in `backend/` to work on API logic.

> **Tip**: Since the backend is Serverless, running it locally (`npm run start:dev`) works like a standard NestJS app. You don't need to emulate Lambda locally for most logic dev.

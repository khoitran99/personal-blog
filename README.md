# 🚀 Personal Blog Platform (Khoi Tran)

> A Serverless Full-Stack Blog Platform built with React, NestJS, and AWS, focusing on performance, minimalism, and a great writing experience.

## 📖 Project Overview

This repository houses the source code for a personal blog platform designed to be scalable, cost-effective, and easy to maintain. It leverages a modern Serverless architecture on AWS (Free Tier eligible).

### ✨ Key Features

- **Public Features**:
  - **Modern UI**: Minimalist design with Dark/Light mode support.
  - **Responsive**: Optimized for all devices (Mobile, Tablet, Desktop).
  - **SEO Optimized**: Dynamic meta tags and Open Graph support.
  - **High Performance**: Static assets served via CDN.

- **Admin/Author Features**:
  - **Secure Authentication**: JWT-based login system.
  - **Rich Text Editor**: Integrated Tiptap editor with support for formatting, lists, and more.
  - **Image Uploads**: Drag-and-drop image uploads directly to S3 (Cover images & Post content).
  - **Draft System**: Write now, publish later. Status management (`DRAFT`/`PUBLISHED`).
  - **Dashboard**: Manage all posts from a centralized admin panel.

### 🛠 Tech Stack

| Component    | Technology      | Details                                                                              |
| ------------ | --------------- | ------------------------------------------------------------------------------------ |
| **Frontend** | React 19 + Vite | Typescript, TailwindCSS v4, Framer Motion, Tiptap Editor.                            |
| **Backend**  | NestJS          | NodeJS runtime, wrapped in `serverless-express`. hosted on AWS Lambda + API Gateway. |
| **Database** | DynamoDB        | NoSQL database for flexible content storage.                                         |
| **Storage**  | AWS S3          | Hosting for frontend assets and user-uploaded media (images).                        |
| **Auth**     | JWT + Passport  | Secure stateless authentication.                                                     |
| **Infra**    | Terraform       | Infrastructure as Code (IaC) for AWS resources.                                      |

---

## 🏗️ Architecture

For detailed architectural diagrams and data flow, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🚀 Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [AWS CLI](https://aws.amazon.com/cli/) configured with your credentials.
- [Terraform](https://www.terraform.io/) installed.
- [Docker](https://www.docker.com/) (for local DynamoDB).

### 1. Backend Setup

1.  Navigate to `backend` directory:

    ```bash
    cd backend
    ```

2.  Create a `.env` file with the following content:

    ```env
    PORT=3000
    AWS_REGION=ap-southeast-1
    AWS_S3_BUCKET_NAME=your-s3-bucket-name
    DYNAMODB_ENDPOINT=http://localhost:8000
    BLOG_TABLE_NAME=Blogs
    USERS_TABLE_NAME=Users
    JWT_SECRET=your-super-secret-jwt-key

    # For local development (if not using AWS profile)
    AWS_ACCESS_KEY_ID=local
    AWS_SECRET_ACCESS_KEY=local
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Start Local Infrastructure (DynamoDB):

    ```bash
    # Ensure Docker is running
    docker-compose up -d

    # Initialize Tables
    ./scripts/create-tables.sh

    # (Optional) Seed Admin User
    node scripts/seed-admin.js
    ```

5.  Run Backend:
    ```bash
    npm run start:dev
    ```
    API will be available at `http://localhost:3000`. Swagger docs at `http://localhost:3000/api`.

### 2. Frontend Setup

1.  Navigate to `frontend` directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file:

    ```env
    VITE_API_URL=http://localhost:3000
    ```

4.  Run locally:
    ```bash
    npm run dev
    ```
    Frontend will be available at `http://localhost:5173`.

---

## 📦 Deployment

This repository handles deployment via **GitHub Actions** (or can be deployed manually via Terraform).

### Infrastructure (Terraform)

1.  Navigate to `terraform/`:
    ```bash
    cd terraform
    terraform init
    terraform apply
    ```
    This will provision:
    - DynamoDB Tables (`Blogs`, `Users`)
    - S3 Bucket (for Media & Frontend)
    - Lambda Function & API Gateway
    - CloudFront Distribution

### CI/CD Workflow

- **Push to `main`**: Triggers deployment.
- **Backend Changes**: Re-bundles Lambda code.
- **Frontend Changes**: Builds React app and syncs to S3.

**Required Secrets in GitHub:**

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `BACKEND_FUNCTION_NAME`
- `FRONTEND_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID`

---

## 🔒 Post-Installation (First Login)

1.  After setting up the backend (local or cloud), you need an admin account.
2.  If running locally, use `node scripts/seed-admin.js` to create a default user (`admin` / `password`).
3.  Navigate to `/login` on the frontend.
4.  Log in and start writing!

---

## 🧪 Testing

```bash
# Backend Tests
cd backend
npm run test      # Unit tests
npm run test:e2e  # End-to-end tests
```

---

**Developed by Khoi Tran**
_Software Engineer | Tech Enthusiast_

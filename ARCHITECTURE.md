# 🏗️ System Architecture

This document outlines the architectural design of the Personal Blog Platform.

## 1. High-Level System Context

The system follows a **Serverless** architecture to minimize maintenance and cost while ensuring high scalability.

```mermaid
graph TD
    User((Reader))
    Admin((Admin/Author))

    subgraph "Frontend Layer"
        SPA[React SPA (Vite)]
    end

    subgraph "AWS Cloud"
        CF[CloudFront CDN]
        S3Frontend[S3 Bucket (Static Assets)]
        APIGW[API Gateway]
        Lambda[NestJS Lambda]
        DDB[(DynamoDB)]
        S3Media[S3 Bucket (Uploads)]
    end

    User -->|Visits| CF
    Admin -->|Visits| CF

    CF --> S3Frontend

    SPA -->|API Requests (REST)| APIGW
    APIGW --> Lambda

    Lambda -->|Store/Retrieve Content| DDB
    Lambda -->|Auth & User Content| DDB

    SPA -->|Upload Images| S3Media
    Lambda -->|Generate Presigned URLs| S3Media
```

---

## 2. Authentication Flow (JWT)

We use **JSON Web Tokens (JWT)** for stateless authentication. The `Users` table in DynamoDB stores the admin credentials (hashed).

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant API as API Gateway + Lambda
    participant DB as DynamoDB Tables

    Admin->>Frontend: Enters Username & Password
    Frontend->>API: POST /auth/login
    API->>DB: Get User by Username
    DB-->>API: User Record (Hash)
    API->>API: Compare Password (bcrypt)

    alt Valid Credentials
        API->>API: Generate JWT Token
        API-->>Frontend: Return Access Token
        Frontend->>Frontend: Store Token (LocalStorage)
        Frontend->>Admin: Redirect to Dashboard
    else Invalid Credentials
        API-->>Frontend: 401 Unauthorized
        Frontend-->>Admin: Show Error
    end
```

---

## 3. Blog Publishing & Image Upload Flow

The platform supports rich text editing with image uploads. To reduce load on the Lambda function, direct S3 uploads via Presigned URLs are used.

```mermaid
sequenceDiagram
    actor Admin
    participant Editor as Tiptap Editor
    participant API as Backend API
    participant S3 as S3 Bucket (Media)
    participant DB as DynamoDB

    note over Admin, Editor: 1. Image Upload Process
    Admin->>Editor: Drag & Drop Image
    Editor->>API: POST /s3/presigned-url
    API->>S3: Request Presigned URL (PutObject)
    S3-->>API: URL + Signature
    API-->>Editor: Return Presigned URL
    Editor->>S3: PUT Image Binary to URL
    S3-->>Editor: 200 OK (Upload Complete)
    Editor->>Editor: Insert Image URL into Content

    note over Admin, Editor: 2. Publish Process
    Admin->>Editor: Click "Save Post"
    Editor->>API: POST /blogs { content: html, status: PUBLISHED, ... }
    API->>API: Verify JWT Token
    API->>DB: Save Blog Record
    DB-->>API: Success
    API-->>Editor: 201 Created
```

---

## 4. Data Model (DynamoDB)

### Local Development vs Cloud

The data model remains the same, but the connection endpoint differs (`localhost:8000` vs `AWS Service Endpoint`).

#### **Table: Blogs**

Partition Key: `id` (UUID)

| Attribute  | Type   | Description                |
| :--------- | :----- | :------------------------- |
| id         | String | Unique Identifier (UUIDv4) |
| title      | String | Blog Title                 |
| content    | String | HTML Content (Sanitized)   |
| status     | String | `DRAFT` or `PUBLISHED`     |
| tags       | List   | Array of strings           |
| coverImage | String | S3 URL of the cover image  |
| createdAt  | String | ISO Timestamp              |
| updatedAt  | String | ISO Timestamp              |

#### **Table: Users**

Partition Key: `id` (UUID)

| Attribute | Type   | Description                 |
| :-------- | :----- | :-------------------------- |
| id        | String | Unique Identifier           |
| username  | String | Login username              |
| password  | String | Bcrypt hash of the password |
| createdAt | String | ISO Timestamp               |

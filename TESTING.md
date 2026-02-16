# Manual Testing Guide

Follow these steps to manually verify the functionality of the Blog Platform.

## 1. Public Access & Layout

### 1.1 Home Page

- **Action**: Navigate to `/`.
- **Expected Result**:
  - [ ] Header is visible with "BLOG." logo and "Home" link.
  - [ ] "Write" link is visible in navigation.
  - [ ] List of published blog posts is displayed in a responsive grid.
  - [ ] Blog cards show: Cover Image (if any), Date, Title, and a short text excerpt (no Markdown/HTML tags).
  - [ ] Empty state ("No posts found") is shown if no blogs exist.

### 1.2 Blog Detail

- **Action**: Click on a blog card.
- **Expected Result**:
  - [ ] Navigates to `/blog/:id`.
  - [ ] "Back to Home" button works.
  - [ ] Cover image is displayed at the top (if exists).
  - [ ] Title, Date, and Tags are visible.
  - [ ] Content is rendered as styled HTML (H1, H2, Lists, Bold, Italic, Links, Code).
  - [ ] Links are blue and underlined; clicking them opens the target.

### 1.3 Theme Toggle

- **Action**: Click the Sun/Moon icon in the header.
- **Expected Result**:
  - [ ] Website theme switches between Light and Dark mode instantly.
  - [ ] Text remains readable in both modes (Contrast check).
  - [ ] Preference persists on reload (if supported by browser storage).

## 2. Authentication

### 2.1 Login Page

- **Action**: Navigate to `/login` or try to access `/admin`.
- **Expected Result**:
  - [ ] Login form is displayed.
  - [ ] Attempting to log in with invalid credentials shows an error toast/alert.
  - [ ] Logging in with valid credentials invokes a redirect to `/admin`.
  - [ ] Toast notification "Login successful" (if implemented) or immediate redirect.

### 2.2 Logout

- **Action**: Click "Logout" button in the header (visible only when logged in).
- **Expected Result**:
  - [ ] user is logged out (token removed).
  - [ ] Redirected to `/login` or `/`.
  - [ ] "Logout" button disappears from header.

### 2.3 Protected Routes

- **Action**: Try to navigate to `/admin` or `/admin/new` while logged out.
- **Expected Result**:
  - [ ] Automatically redirected to `/login`.

## 3. Content Management (Admin)

### 3.1 Dashboard

- **Action**: Navigate to `/admin` (while logged in).
- **Expected Result**:
  - [ ] List of all blog posts (Published & Drafts) is displayed in a table.
  - [ ] "New Post" button is visible.
  - [ ] Each row shows Title, Status, Date, Edit button, and Delete button.
  - [ ] Clicking the blog title opens the blog detail view.

### 3.2 Create New Post

- **Action**: Click "New Post".
- **Expected Result**:
  - [ ] Navigates to `/admin/new` (Editor).
  - [ ] Editor is empty.
- **Action**: Fill in Title, Content (use Bold, Identify H1/H2, Lists, Link, Code), Status (Published), and optional Cover Image/Tags. Click "Save".
- **Expected Result**:
  - [ ] Toast notification "Post created successfully" appears.
  - [ ] Redirects to `/admin`.
  - [ ] New post appears in the dashboard list.

### 3.3 Visual Editor (Rich Text)

- **Action**: In the editor, use the toolbar.
- **Expected Result**:
  - [ ] **Bold/Italic**: Text applied correctly.
  - [ ] **Headings**: H1/H2/H3 text changes size visually.
  - [ ] **Lists**: Bullet and Numbered lists indent correctly.
  - [ ] **Link**: Selecting text and clicking Link icon adds a link.
  - **Image**: Clicking Image icon (if implemented) invokes upload value.
  - [ ] **Markdown**: If you paste markdown, it should ideally convert to rich text (or handle smoothly).

### 3.4 Edit Post

- **Action**: Click "Edit" (Pencil icon) on a post in Dashboard.
- **Expected Result**:
  - [ ] Navigates to `/admin/edit/:id`.
  - [ ] Form is pre-filled with existing Title, Content, Status, etc.
  - [ ] Styled content loads correctly in the editor (not raw HTML/Markdown).
- **Action**: Change content/title and click "Save".
- **Expected Result**:
  - [ ] Toast notification "Post updated successfully" appears.
  - [ ] Redirects to `/admin`.
  - [ ] Changes are reflected in `/blog/:id` view.

### 3.5 Delete Post

- **Action**: Click "Delete" (Trash icon) on a post.
- **Expected Result**:
  - [ ] Toast loading state "Deleting...".
  - [ ] Post is removed from the table.
  - [ ] Toast success "Post deleted".

## 4. Error Handling

### 4.1 404 Not Found (Optional)

- **Action**: Navigate to `/blog/non-existent-id`.
- **Expected Result**:
  - [ ] Shows "Blog not found" message or Error page with "Go Home" button.

### 4.2 Unauthorized API Access

- **Action**: (Expert) Manually delete token from LocalStorage while on `/admin` and try to refresh/delete a post.
- **Expected Result**:
  - [ ] API returns 401.
  - [ ] App automatically redirects to `/login`.

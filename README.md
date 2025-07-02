# Blog Frontend

A modern blog application built with Angular 19, Angular Material, Bootstrap, and more. This frontend application connects to a Node.js/Express.js backend with MariaDB for data storage.

## Project Overview

This is a full-featured blog platform that allows users to:
- View blog posts on the landing page
- Search for specific blog posts
- Create new blog posts with images
- Edit existing blog posts
- Delete blog posts with confirmation
- Register, login, and manage user accounts
- Recover forgotten passwords

The application uses Angular's latest features and follows modern web development practices.

## Project Structure

```
blog-frontend/
├── src/
│   ├── app/
│   │   ├── confirmation-dialog/    # Reusable confirmation dialog component
│   │   ├── core/                   # Core functionality
│   │   │   └── interceptors/       # HTTP interceptors (auth)
│   │   ├── create-blog/            # Blog creation/editing component
│   │   ├── footer/                 # Footer component
│   │   ├── header/                 # Header/navigation component
│   │   ├── landing/                # Landing page component
│   │   ├── login-register/         # Authentication component
│   │   ├── app.component.*         # Root component files
│   │   ├── app.config.ts           # App configuration
│   │   └── app.routes.ts           # Application routes
│   ├── assets/                     # Static assets
│   ├── index.html                  # Main HTML file
│   ├── main.ts                     # Application entry point
│   └── styles.scss                 # Global styles
├── angular.json                    # Angular configuration
├── package.json                    # Dependencies and scripts
└── tsconfig.json                   # TypeScript configuration
```

## Components and Services

### Core Components

#### Landing Component
- **Purpose**: Displays the main page with blog posts
- **Features**:
  - Blog post grid display
  - Search functionality
  - Blog post cards with title, content, image, and author info
  - Edit and delete options for blog posts

#### Login/Register Component
- **Purpose**: Handles user authentication
- **Features**:
  - Login form with email and password
  - Registration form with validation
  - Forgot password functionality
  - Profile image upload

#### Create Blog Component
- **Purpose**: Allows creation and editing of blog posts
- **Features**:
  - Blog title and content fields
  - Featured image upload with validation
  - Different modes for create and edit

#### Confirmation Dialog Component
- **Purpose**: Reusable dialog for confirming actions
- **Features**:
  - Customizable title and message
  - Yes/No buttons for confirmation

### Core Services and Utilities

#### Auth Interceptor
- **Purpose**: Handles authentication for HTTP requests
- **Features**:
  - Adds JWT token to outgoing requests
  - Handles 401/403 errors by redirecting to landing page

## Application Flow

1. **User Authentication**:
   - Users can register with email, password, and profile image
   - Login with email and password
   - JWT token stored in localStorage for authentication

2. **Blog Viewing**:
   - Landing page displays all blog posts in a grid
   - Users can search for specific blogs
   - Each blog shows title, content excerpt, image, and author details

3. **Blog Management**:
   - Authenticated users can create new blogs
   - Users can edit or delete their own blogs
   - Delete action requires confirmation

## Setup and Usage

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository
   ```
   git clone <repository-url>
   cd blog-frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```
   The application will be available at `http://localhost:4200/`

### Building for Production
```
npm run build
```
The build artifacts will be stored in the `dist/` directory.

### Running Tests
```
npm test
```

## Technologies Used

- **Angular 19**: Frontend framework
- **Angular Material**: UI component library
- **Bootstrap**: CSS framework for responsive design
- **ngx-toastr**: Toast notifications
- **RxJS**: Reactive programming library

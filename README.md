# Express App with Reusable Modules

This is an Express.js application that I use to practice and implement various libraries as reusable modules.

## Modules Implemented

### 1. Local JWT Authentication
- **Description**: Implements JSON Web Token (JWT) authentication with local storage.
- **Features**:
  - Token-based authentication.
  - Secure storage of JWT in local storage.
  - Middleware for protected routes.

### 2. Passport Authentication
- **Local Strategy (Cookie Session)**:
  - Username and password authentication.
  - Session management using cookies.
- **Google OAuth Strategy (Cookie Session)**:
  - OAuth 2.0 integration with Google.
  - Secure session handling with cookies.

### 3. Multer Upload with Dynamic Middleware
- **Description**: File upload functionality using Multer with customizable middleware.
- **Features**:
  - Supports single and multiple file uploads.
  - Dynamic middleware for file type validation and storage configuration.
  - Error handling for invalid uploads.

### 4. Stripe Payment Integration
- **Embedded Checkout**:
  - Server-rendered HTML for Stripe's embedded checkout.
  - Seamless payment flow for users.
- **Embedded Card Entering Form**:
  - Custom card input form for payments.
  - REST API endpoints for payment processing.

### 5. Socket.IO Real-Time Communication
- **Description**: Implements a public broadcast chat system using Socket.IO.
- **Features**:
  - Server-rendered chat interface.
  - Real-time messaging with public broadcast functionality.
  - Scalable WebSocket communication.

## Getting Started

### Prerequisites
- Node.js
- npm
- Stripe account (for payment features)
- Google Developer Console credentials (for OAuth)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add necessary keys (e.g., `STRIPE_SECRET_KEY`, `GOOGLE_CLIENT_ID`, etc.).
4. Run the application:
   ```bash
   npm start
   ```

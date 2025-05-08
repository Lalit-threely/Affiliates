# Affiliates Management System

A backend system for managing affiliates, their relationships, and earnings.

## Features

- Affiliate management (CRUD operations)
- Hierarchical affiliate structure
- Commission tracking
- Earnings management
- Secure authentication

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Affiliates
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=affiliates_db
JWT_SECRET=your_jwt_secret
```

4. Build the project:
```bash
npm run build
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Affiliates

- `POST /api/affiliates` - Create a new affiliate
- `GET /api/affiliates` - Get all affiliates
- `GET /api/affiliates/:id` - Get affiliate by ID
- `PUT /api/affiliates/:id` - Update affiliate
- `DELETE /api/affiliates/:id` - Delete affiliate
- `GET /api/affiliates/:id/earnings` - Get affiliate earnings

## Project Structure

```
Affiliates/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── server.ts       # Application entry point
└── package.json    # Project dependencies
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

ISC 
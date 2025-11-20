# Notes App Backend (NestJS + GraphQL)

This is the backend for a Notes application built using [NestJS](https://nestjs.com/) and [GraphQL](https://graphql.org/). It uses [Prisma](https://www.prisma.io/) as the ORM for database management and supports features like authentication, note management, and AWS integration.

## Features

- User authentication (JWT)
- Create, update, delete, and fetch notes
- Mark notes as important
- AWS integration (for file uploads, etc.)
- Custom error handling and logging
- GraphQL API
- Prisma ORM with migrations

## Project Structure

```
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── schema.gql
├── tsconfig.build.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.module.ts
│   ├── env.ts
│   ├── main.ts
│   ├── auth/
│   ├── aws/
│   ├── decorators/
│   ├── enum/
│   ├── filters/
│   ├── guard/
│   ├── jwt-token/
│   ├── logger/
│   ├── notes/
│   └── prisma/
├── test/
│   └── app.e2e-spec.ts
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Docker (for running database locally)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd notes-app-backend(nest)
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and update values as needed.

4. **Run database migrations:**

   ```bash
   npx prisma migrate deploy
   ```

5. **Start the application:**
   ```bash
   npm run start:dev
   ```

### Running with Docker

You can use `docker-compose.yml` to run the database and other services locally.

```bash
docker-compose up -d
```

## Scripts

- `npm run start:dev` — Start development server
- `npm run build` — Build the project
- `npm run test` — Run unit tests
- `npm run test:e2e` — Run end-to-end tests
- `npx prisma migrate deploy` — Apply migrations

## API

- GraphQL endpoint: `/graphql`
- Prisma Studio: `npx prisma studio`

## Folder Overview

- `src/auth` — Authentication logic (JWT, resolvers, DTOs)
- `src/notes` — Notes CRUD operations
- `src/aws` — AWS integration
- `src/prisma` — Prisma service and module
- `src/filters` — Custom error filters
- `src/guard` — JWT guards
- `src/logger` — Logger service

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.

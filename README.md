## Micro-Learning Platform (NestJS + Prisma + MySQL)

### A full-featured micro-learning backend built with [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), and [MySQL]. It supports authentication, student/instructor roles, course enrollment, lessons, and Q&A functionality.

---

## Features

- Authentication (Sign up / Sign in)
- Role-based access (Student / Instructor)
- Courses & Lessons
- Student Enrollment
- Question and Answer support
- Caching support using NestJS Cache Module
- Scheduled tasks (Cron jobs) for periodic operations
- E2E and Unit Testing (Jest + Supertest)
- Dockerized development
- Prisma ORM with MySQL
---

## Tech Stack

- **Backend**: NestJS (TypeScript)
- **Database**: MySQL (via Prisma)
- **Auth**: JWT (Access Token)
- **Testing**: Jest, Supertest
- **Deployment**: Docker, Docker Compose

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/micro-learning-platform.git
cd micro-learning-platform
```
### 2. Install dependencies

```bash
npm install
```

### 3. Create a .env file in the root:

```bash
DATABASE_URL="mysql://nest:nestpass@localhost:3306/nest"
JWT_SECRET="your_jwt_secret"
```

### 4. Run development server

```bash
npm run start:dev
```

### 5. Database migration (Prisma)

```bash
npx prisma migrate dev --name init
```

## Docker Setup 
### Build and start app with MySQL
```bash
docker-compose up --build
```

## Running Tests
### Unit Tests
```bash
npm run test
```
### End-to-End Tests
```bash
npm run test:e2e
```

## Scripts
```bash
npm run start           # Start production server
npm run start:dev       # Start dev server with watch
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
npm run build           # Compile project
npx prisma studio       # View DB in browser
```
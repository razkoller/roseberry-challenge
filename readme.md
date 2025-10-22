# TaskApp - Full-Stack Task Management Application

A simple and elegant task management application built with React Native and Node.js, featuring user authentication and full CRUD operations.

## Features

- User registration and authentication with JWT
- Create, read, update, and delete tasks
- Mark tasks as completed
- Clean and modern UI
- Fully containerized with Docker
- RESTful API with Swagger documentation

## Tech Stack

**Frontend:**
- React Native with TypeScript
- Expo Router for navigation
- Axios for API requests
- AsyncStorage for token persistence

**Backend:**
- Node.js with TypeScript
- Express.js
- PostgreSQL database
- JWT authentication
- Swagger/OpenAPI documentation

**DevOps:**
- Docker & Docker Compose
- Containerized services

## Prerequisites

Before running this application, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (version 8 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`

For building the Android APK:
- [EAS CLI](https://docs.expo.dev/build/setup/): `npm install -g eas-cli`
- An Expo account (free tier is sufficient)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd roseberry-challenge
```

### 2. Setup Environment Variables

Copy the example environment file and configure if needed:

```bash
cp .env.example .env
```

The default configuration should work out of the box for local development.

### 3. Start Backend Services

Start the PostgreSQL database and Node.js API server using Docker Compose:

```bash
docker compose up --build
```

This command will:
- Build the backend Docker image
- Start PostgreSQL database
- Start the Node.js API server
- Run database migrations automatically
- Make the API available at `http://localhost:3000`

Wait for the message "Server is running on port 3000" before proceeding.

### 4. Seed the Database (Optional)

To populate the database with demo data:

```bash
docker compose exec backend npm run seed
```

This creates a demo user with credentials:
- Email: `demo@example.com`
- Password: `demo123`

### 5. Setup Mobile Application

Open a new terminal and navigate to the mobile directory:

```bash
cd mobile
npm install
```

**Important:** If testing on a physical device, update the API URL in `mobile/src/services/api.ts`:

```typescript
// Replace localhost with your computer's local IP address
const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000/api';
```

To find your local IP:
- **macOS/Linux:** Run `ifconfig` or `ip addr show`
- **Windows:** Run `ipconfig`

Look for your local network IP (usually starts with 192.168.x.x or 10.0.x.x).

### 6. Start the Mobile App

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with the Expo Go app on your physical device

## API Documentation

Once the backend is running, access the interactive API documentation:

**Swagger UI:** http://localhost:3000/api-docs

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

**Tasks (require authentication):**
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Authentication

All task endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example API Requests

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo123"
  }'
```

**Get Tasks:**
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <your_token>"
```

**Create Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the mobile app"
  }'
```

**Update Task:**
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "isCompleted": true
  }'
```

**Delete Task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer <your_token>"
```

## Building Android APK

### Prerequisites for APK Build

1. Install EAS CLI globally:
```bash
npm install -g eas-cli
```

2. Create a free Expo account at https://expo.dev/signup

3. Login to EAS CLI:
```bash
eas login
```

### Build Configuration

The project includes a basic EAS build configuration. To customize it, create `mobile/eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Building the APK

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Configure the project (first time only):
```bash
eas build:configure
```

3. Build the APK:
```bash
eas build --platform android --profile production
```

This process will:
- Upload your project to Expo's build servers
- Build the Android APK
- Provide a download link when complete

The build typically takes 10-20 minutes. You'll receive an email when it's done, or you can monitor progress at https://expo.dev/accounts/[your-account]/projects/taskapp/builds.

4. Download and install the APK on your Android device.

### Local APK Build (Alternative)

For a local build without using EAS:

```bash
cd mobile
npx expo prebuild
cd android
./gradlew assembleRelease
```

The APK will be available at `mobile/android/app/build/outputs/apk/release/app-release.apk`.

**Note:** Local builds require Android Studio and the Android SDK to be installed.

## Project Structure

```
roseberry-challenge/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts      # Database connection and initialization
│   │   │   └── swagger.ts       # API documentation configuration
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Authentication logic
│   │   │   └── taskController.ts    # Task CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT authentication middleware
│   │   ├── routes/
│   │   │   └── index.ts         # API route definitions
│   │   ├── database/
│   │   │   └── seed.ts          # Database seeding script
│   │   └── server.ts            # Express server setup
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── mobile/
│   ├── app/
│   │   ├── _layout.tsx          # Root layout with auth routing
│   │   ├── index.tsx            # Login/Register screen
│   │   └── tasks.tsx            # Tasks management screen
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Authentication state management
│   │   └── services/
│   │       └── api.ts           # API client and types
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Development

### Backend Development

The backend supports hot-reloading during development. Any changes to TypeScript files will automatically restart the server.

View logs:
```bash
docker compose logs -f backend
```

Access PostgreSQL database:
```bash
docker compose exec postgres psql -U taskapp -d taskapp_db
```

### Mobile Development

The mobile app uses Expo's fast refresh. Changes to the code will automatically update in the app.

Clear cache if needed:
```bash
cd mobile
npm start -- --clear
```

### Running Tests

While this project doesn't include a full test suite (due to the 7-hour time constraint), here's how you would structure testing:

**Backend:**
```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
npm test
```

**Mobile:**
```bash
cd mobile
npm install --save-dev jest @testing-library/react-native
npm test
```

## Troubleshooting

### Backend Issues

**Database connection fails:**
```bash
# Stop all containers
docker compose down

# Remove volumes and restart
docker compose down -v
docker compose up --build
```

**Port 3000 already in use:**
```bash
# Change the PORT in .env file
PORT=3001

# Restart containers
docker compose down
docker compose up
```

### Mobile Issues

**Cannot connect to API:**
- Ensure backend is running: `docker compose ps`
- Check API URL in `mobile/src/services/api.ts`
- If using physical device, use your local IP instead of localhost
- Ensure firewall allows connections on port 3000

**Expo app won't start:**
```bash
cd mobile
rm -rf node_modules
npm install
npm start -- --clear
```

**Build fails:**
- Ensure you're logged into EAS: `eas whoami`
- Check project configuration: `eas build:configure`
- Try preview build first: `eas build --platform android --profile preview`

## Security Considerations

This is a demo application. For production use, consider:

- Use environment-specific secrets (never commit real secrets)
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS/TLS
- Implement refresh tokens
- Add password complexity requirements
- Enable CORS only for specific origins
- Add request logging and monitoring
- Implement proper error handling without exposing internals
- Add database connection pooling limits
- Use prepared statements (already implemented via parameterized queries)

## Possible Improvements

Given more time, these enhancements would add value:

**Features:**
- Task categories and tags
- Due dates and reminders
- Task priority levels
- Search and filter functionality
- Sorting options
- Task sharing between users
- File attachments
- Dark mode support
- Offline support with sync

**Technical:**
- Comprehensive unit and integration tests
- E2E testing with Detox
- CI/CD pipeline with GitHub Actions
- Database migrations with a proper migration tool
- Request validation middleware
- Rate limiting
- Caching with Redis
- WebSocket support for real-time updates
- Pagination for large task lists
- Background sync for mobile
- Push notifications
- Analytics integration

**DevOps:**
- Kubernetes deployment configuration
- Health checks and monitoring
- Log aggregation
- Automated backups
- Staging environment
- Load balancing

## License

This project was created as a technical assessment for Roseberry.

## Support

For issues or questions, please contact the development team or create an issue in the repository.
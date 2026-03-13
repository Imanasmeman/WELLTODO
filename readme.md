# Daily Task Management System

A production-quality MERN (MongoDB, Express, React, Node.js) task management application with automated end-of-day processing and email notifications.

## Features

- **User Authentication**: Secure login and registration
- **Task Management**: Create, update, delete, and manage tasks
- **Subtasks**: Add and track subtasks for each task
- **Status Tracking**: Track task status (Pending, In Progress, Completed, Not Completed)
- **Today's Board**: View and manage tasks for today with real-time progress tracking
- **Task History**: Browse archived tasks from any previous date
- **End-of-Day (EOD) Automation**: Automatic daily task archiving at 23:59
- **Email Notifications**: Receive daily summary emails with task statistics
- **Responsive UI**: Beautiful, mobile-friendly interface built with TailwindCSS

## Tech Stack

- **Frontend**: React 18, React Router, TailwindCSS, Lucide React Icons, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Scheduling**: node-cron
- **Email**: Nodemailer
- **Security**: bcryptjs for password hashing

## Project Structure

```
project/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── taskController.js  # Task business logic
│   │   └── userController.js  # User auth logic
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Task.js            # Task schema
│   │   ├── SubTask.js         # Subtask schema
│   │   ├── ArchivedTask.js    # Archived task schema
│   │   └── DailySummary.js    # Daily summary schema
│   ├── routes/
│   │   ├── taskRoutes.js      # Task endpoints
│   │   └── userRoutes.js      # User endpoints
│   ├── services/
│   │   ├── emailService.js    # Email notification logic
│   │   └── summaryService.js  # Summary calculation
│   ├── jobs/
│   │   └── eodCron.js         # End-of-day cron job
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js    # Error handling
│   ├── utils/
│   │   └── dateUtils.js       # Date utility functions
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation component
│   │   ├── TaskCard.jsx       # Task display component
│   │   ├── TaskForm.jsx       # Task creation form
│   │   └── SubTaskList.jsx    # Subtask list component
│   ├── pages/
│   │   ├── TodayBoard.jsx     # Today's tasks view
│   │   ├── HistoryPage.jsx    # Historical tasks view
│   │   └── LoginPage.jsx      # Authentication page
│   ├── context/
│   │   └── TaskContext.jsx    # Global task state
│   ├── hooks/
│   │   └── useTasks.js        # Custom task hook
│   ├── services/
│   │   └── api.js             # API client
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
│
├── .env                       # Environment variables
├── package.json               # Dependencies
├── vite.config.ts             # Vite configuration
└── tailwind.config.js         # TailwindCSS configuration
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- MongoDB server running locally on `mongodb://localhost:27017`

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** in `.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/daily-task-management
   NODE_ENV=development

   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   CRON_TIME=59 23 * * *
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Run the application**:
   - **Development (both frontend and backend)**:
     ```bash
     npm run dev
     ```
   - **Backend only**:
     ```bash
     npm run dev:server
     ```
   - **Frontend only**:
     ```bash
     npm run dev:client
     ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Production mode**:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

#### Login User
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```
GET /api/users/profile
Authorization: Bearer <token>
```

### Task Endpoints

#### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the MERN project"
}
```

#### Get Today's Tasks
```
GET /api/tasks/today
Authorization: Bearer <token>
```

#### Get Tasks by Date
```
GET /api/tasks/history?date=2024-03-12
Authorization: Bearer <token>
```

#### Update Task
```
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "In Progress"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

### Subtask Endpoints

#### Add Subtask
```
POST /api/tasks/:id/subtask
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Subtask title"
}
```

#### Update Subtask
```
PUT /api/tasks/:taskId/subtask/:subtaskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated subtask",
  "status": "Completed"
}
```

#### Delete Subtask
```
DELETE /api/tasks/:taskId/subtask/:subtaskId
Authorization: Bearer <token>
```

## End-of-Day (EOD) Cron Job

### How It Works

The EOD cron job runs automatically every day at **23:59** (configurable via `CRON_TIME` env variable).

### EOD Process

1. **Fetch Today's Tasks**: Retrieves all tasks created today for each user
2. **Calculate Summary**:
   - Total tasks count
   - Completed tasks count
   - Pending tasks count
   - Completion percentage
3. **Save Summary**: Stores daily summary in DailySummary collection
4. **Send Email**: Sends email notification with daily statistics
5. **Update In-Progress Tasks**: Changes any "In Progress" tasks to "Not Completed"
6. **Archive Tasks**: Moves all tasks to ArchivedTask collection
7. **Transaction Safety**: Uses MongoDB transactions to ensure atomic operations

### Cron Configuration

Edit `.env` to change the cron time:
```
CRON_TIME=59 23 * * *
```

Cron format: `minute hour dayOfMonth month dayOfWeek`
- `59 23 * * *` = 23:59 every day
- `0 9 * * 1-5` = 09:00 weekdays only
- `30 18 * * *` = 18:30 every day

## Email Configuration

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Select "App passwords"
   - Choose Mail and Windows Computer
   - Copy the generated password
3. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### Email Features

- Daily summary sent at EOD
- Contains task statistics and completion percentage
- Includes execution timestamp

## Database Schemas

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: String (required),
  description: String,
  status: Enum (Pending, In Progress, Completed, Not Completed),
  userId: ObjectId (ref: User),
  subTasks: [ObjectId] (ref: SubTask),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### SubTask
```javascript
{
  title: String (required),
  status: Enum (Pending, Completed),
  taskId: ObjectId (ref: Task),
  createdAt: Date,
  updatedAt: Date
}
```

### ArchivedTask
```javascript
{
  originalTaskId: ObjectId,
  title: String,
  description: String,
  finalStatus: Enum,
  userId: ObjectId (ref: User),
  subTasks: [{ title, status }],
  completedAt: Date,
  archivedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### DailySummary
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  totalTasks: Number,
  completedTasks: Number,
  pendingTasks: Number,
  completionPercentage: Number,
  generatedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## UI Components

### Navbar
- User information display
- Navigation between Today and History
- Logout functionality

### TaskCard
- Expandable task details
- Status badge with color coding
- Edit and delete buttons
- Subtask management
- Inline editing

### TaskForm
- Task creation form
- Title and description fields
- Input validation
- Loading state

### SubTaskList
- Checkbox-based completion tracking
- Add/delete subtasks
- Visual feedback

## State Management

Uses React Context API for global task state:
- Tasks list
- Loading state
- Error handling
- Task CRUD operations

## Error Handling

### Backend
- Express error middleware for consistent error responses
- Input validation with express-validator
- MongoDB operation error handling
- JWT validation errors

### Frontend
- API error interception
- User-friendly error messages
- Loading states
- Try-catch blocks in async operations

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Secure token storage in localStorage
- Protected routes
- CORS configuration
- Validation on all endpoints

## Performance Optimizations

- MongoDB indexes on frequently queried fields (createdAt, userId, status)
- Debounced API calls
- Lazy loading with React Router
- Efficient state management
- Populated relationships to reduce database queries

## Responsive Design

- Mobile-first approach
- TailwindCSS breakpoints
- Flexible grid layouts
- Touch-friendly buttons
- Optimized for screens 320px to 2560px

## Future Enhancements

- Task categories/tags
- Task priority levels
- Recurring tasks
- Team collaboration
- Advanced analytics dashboard
- Dark mode
- Mobile app
- Calendar view
- Real-time notifications
- Integration with calendar services

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env`
- Verify port 27017 is accessible

### Email Not Sending
- Verify Gmail App Password is correct
- Ensure 2FA is enabled on Gmail
- Check firewall/network access
- Review server logs

### Tasks Not Appearing
- Verify JWT token is valid
- Check browser localStorage for token
- Ensure MongoDB has data
- Review network tab for API errors

### Port 5000 Already in Use
- Kill process: `lsof -ti:5000 | xargs kill -9`
- Or change `PORT` in `.env`

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes with meaningful messages
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please open a GitHub issue.

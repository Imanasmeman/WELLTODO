# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Browser (Frontend)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Application (SPA)                 │   │
│  │  ┌────────────────┐  ┌────────────────┐             │   │
│  │  │  LoginPage     │  │  TodayBoard    │             │   │
│  │  │  HistoryPage   │  │  Components    │             │   │
│  │  │  TaskCard      │  │  TaskForm      │             │   │
│  │  └────────────────┘  └────────────────┘             │   │
│  │  ┌────────────────────────────────────┐             │   │
│  │  │   TaskContext (State Management)   │             │   │
│  │  └────────────────────────────────────┘             │   │
│  │  ┌────────────────────────────────────┐             │   │
│  │  │   API Service (Axios HTTP Client)  │             │   │
│  │  └────────────────────────────────────┘             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP Requests (JSON)
                          │ JWT Authentication
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         Node.js + Express Server (Backend)                  │
│  PORT: 5000                                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express Middleware Stack                │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │  CORS │ Body Parser │ Error Handler │ Auth     │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes                              │   │
│  │  /api/users    (login, register, profile)           │   │
│  │  /api/tasks    (CRUD operations)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Controllers                             │   │
│  │  ├─ taskController.js                               │   │
│  │  └─ userController.js                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Services Layer                          │   │
│  │  ├─ emailService.js                                 │   │
│  │  └─ summaryService.js                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Background Jobs                         │   │
│  │  └─ eodCron.js (Runs at 23:59 daily)               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Mongoose ODM
                          │ TCP Connection
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Database                               │
│              (localhost:27017)                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections:                                        │   │
│  │  ├─ users (User accounts)                          │   │
│  │  ├─ tasks (Active tasks)                           │   │
│  │  ├─ subtasks (Task subtasks)                       │   │
│  │  ├─ archivedtasks (EOD archived tasks)             │   │
│  │  └─ dailysummaries (Daily stats)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Indexes:                                            │   │
│  │  ├─ users: email (unique)                           │   │
│  │  ├─ tasks: userId, createdAt, status               │   │
│  │  ├─ subtasks: taskId                               │   │
│  │  ├─ archivedtasks: userId, archivedAt              │   │
│  │  └─ dailysummaries: userId, date                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ (Email sent from cron job)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Gmail SMTP Server                              │
│              (nodemailer integration)                       │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow - Task Creation

```
┌──────────┐
│ User     │
│ clicks   │
│ "Create" │
└────┬─────┘
     │
     │ Form Submit
     │
     ▼
┌──────────────────────┐
│ TaskForm Component   │
│ (src/components/)    │
└────┬────────────────┘
     │
     │ Validation
     │ + API Call
     │
     ▼
┌──────────────────────┐
│ API Service          │
│ (axios)              │
│ POST /api/tasks      │
└────┬────────────────┘
     │ HTTP Request
     │ + JWT Token
     │
     ▼
┌──────────────────────┐
│ Express Router       │
│ /api/tasks           │
└────┬────────────────┘
     │
     │ Auth Middleware
     │ Validates JWT
     │
     ▼
┌──────────────────────┐
│ Task Controller      │
│ createTask()         │
└────┬────────────────┘
     │
     │ Validate Input
     │
     ▼
┌──────────────────────┐
│ Mongoose Model       │
│ new Task()           │
│ .save()              │
└────┬────────────────┘
     │
     │ MongoDB
     │ Insert
     │
     ▼
┌──────────────────────┐
│ MongoDB Database     │
│ tasks collection     │
└────┬────────────────┘
     │
     │ Response
     │ 201 Created
     │
     ▼
┌──────────────────────┐
│ Frontend receives    │
│ new task data        │
└────┬────────────────┘
     │
     │ Update State
     │ (TaskContext)
     │
     ▼
┌──────────────────────┐
│ UI Re-renders        │
│ Task appears in list │
└──────────────────────┘
```

## Data Flow - EOD Cron Job

```
23:59:00
   │
   ▼
┌──────────────────────────┐
│ EOD Cron Job triggers    │
│ eodCron.js               │
└────┬─────────────────────┘
     │
     │ For each user in database:
     │
     ▼
┌──────────────────────────┐
│ Fetch today's tasks      │
│ (createdAt = today)      │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Calculate summary:       │
│ - total count            │
│ - completed count        │
│ - percentage             │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Start MongoDB            │
│ Transaction              │
└────┬─────────────────────┘
     │
     ├─► Save DailySummary
     │
     ├─► Update In Progress
     │   → Not Completed
     │
     ├─► Archive each task
     │   Task → ArchivedTask
     │
     ├─► Delete SubTasks
     │
     ├─► Delete Tasks
     │
     └─► Commit/Rollback
         (atomic)
     │
     ▼
┌──────────────────────────┐
│ Send Email via           │
│ Nodemailer (Gmail SMTP)  │
│ to user email            │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Email Delivered          │
│ Daily summary received   │
└──────────────────────────┘
```

## Component Hierarchy

```
App
├── Router
│   ├── LoginPage
│   │   └── Authentication Form
│   │
│   └── TaskProvider
│       ├── Navbar
│       │   ├── Logo
│       │   ├── Navigation Links
│       │   └── User Menu
│       │
│       └── Routes
│           ├── TodayBoard
│           │   ├── Stats Cards
│           │   │   ├── Total Tasks
│           │   │   ├── Completed
│           │   │   └── Completion %
│           │   │
│           │   ├── Progress Bar
│           │   ├── TaskForm
│           │   └── TaskCard[] (list)
│           │       ├── TaskCard
│           │       │   ├── Title
│           │       │   ├── Description
│           │       │   ├── Status Badge
│           │       │   └── (expanded)
│           │       │       ├── SubTaskList
│           │       │       │   └── SubTask[] (checkboxes)
│           │       │       ├── Add SubTask
│           │       │       ├── Edit Button
│           │       │       └── Delete Button
│           │       │
│           │       └── [More TaskCards]
│           │
│           └── HistoryPage
│               ├── Date Picker
│               └── ArchivedTaskList
│                   └── ArchivedTask (display only)
```

## State Management Flow

```
TaskContext
├── State
│   ├── tasks: []
│   ├── loading: false
│   └── error: null
│
├── Actions (Dispatchers)
│   ├── fetchTodayTasks()
│   ├── createTask(title, description)
│   ├── updateTask(id, updates)
│   ├── deleteTask(id)
│   ├── addSubTask(taskId, title)
│   ├── updateSubTask(taskId, subtaskId, updates)
│   └── deleteSubTask(taskId, subtaskId)
│
└── Consumers (Hooks)
    └── useTasks() → returns { tasks, loading, error, ...actions }
        ├── TodayBoard
        ├── TaskForm
        ├── TaskCard
        └── SubTaskList
```

## API Endpoint Structure

```
http://localhost:5000/api

├── /users
│   ├── POST /register        → Create user account
│   ├── POST /login           → Authenticate user
│   └── GET /profile          → Get current user (protected)
│
└── /tasks
    ├── POST /                → Create task (protected)
    ├── GET /today            → Get today's tasks (protected)
    ├── GET /history          → Get archived by date (protected)
    ├── PUT /:id              → Update task (protected)
    ├── DELETE /:id           → Delete task (protected)
    ├── POST /:id/subtask     → Add subtask (protected)
    ├── PUT /:taskId/subtask/:subtaskId  → Update subtask
    └── DELETE /:taskId/subtask/:subtaskId → Delete subtask
```

## Database Schema Relationships

```
User
├── _id (ObjectId)
├── name
├── email
├── password (hashed)
└── timestamps

Task
├── _id (ObjectId)
├── title
├── description
├── status
├── userId → User._id
├── subTasks: [SubTask._id]
├── completedAt
└── timestamps

SubTask
├── _id (ObjectId)
├── title
├── status
├── taskId → Task._id
└── timestamps

ArchivedTask
├── _id (ObjectId)
├── originalTaskId → Task._id
├── title
├── description
├── finalStatus
├── userId → User._id
├── subTasks: [{title, status}]
├── completedAt
├── archivedAt
└── timestamps

DailySummary
├── _id (ObjectId)
├── userId → User._id
├── date
├── totalTasks
├── completedTasks
├── pendingTasks
├── completionPercentage
├── generatedAt
└── timestamps
```

## Authentication Flow

```
Login Request
     │
     ▼
┌──────────────────────┐
│ User Credentials     │
│ (email, password)    │
└────┬────────────────┘
     │
     ▼
┌──────────────────────┐
│ Backend validates    │
│ userController.login()
└────┬────────────────┘
     │
     ├─ Hash check: bcryptjs.compare()
     │
     ▼
┌──────────────────────┐
│ Match found?         │
└────┬────────────────┘
     │
   ╔═╩═╗
   ║   ║
  YES  NO
   ║   ║
   ║   ▼
   ║  Error 401
   │
   ▼
┌──────────────────────┐
│ Generate JWT Token   │
│ jwt.sign(userId)     │
│ Expires in 30 days   │
└────┬────────────────┘
     │
     ▼
┌──────────────────────┐
│ Return Response:     │
│ - token              │
│ - user data          │
└────┬────────────────┘
     │
     ▼
┌──────────────────────┐
│ Frontend stores      │
│ token in localStorage
└────┬────────────────┘
     │
     ▼
┌──────────────────────┐
│ For future requests: │
│ Add to headers:      │
│ Authorization: Bearer <token>
└────┬────────────────┘
     │
     ▼
┌──────────────────────┐
│ Backend validates    │
│ authMiddleware       │
│ jwt.verify(token)    │
└────┬────────────────┘
     │
     ├─ Extract userId from token
     ├─ Attach to req.userId
     └─ Proceed to controller
```

## Technology Stack

### Frontend
- **React 18**: UI framework
- **React Router v6**: Client-side routing
- **TailwindCSS**: Styling framework
- **Lucide React**: Icon library
- **Axios**: HTTP client
- **Context API**: State management

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **node-cron**: Job scheduling
- **nodemailer**: Email sending

### Development
- **Vite**: Build tool
- **npm**: Package manager

## Performance Considerations

1. **Database Indexes**: On frequently queried fields
2. **Lazy Loading**: Components loaded on demand
3. **API Caching**: Frontend caches task data
4. **Efficient Queries**: Only fetch required fields
5. **Debouncing**: Prevent excessive API calls
6. **Pagination Ready**: Structure supports pagination

## Security Measures

1. **JWT Authentication**: Stateless, secure tokens
2. **Password Hashing**: bcryptjs with salt rounds
3. **CORS**: Restricted to frontend origin
4. **Input Validation**: express-validator
5. **Error Handling**: Generic error messages
6. **Environment Variables**: Secrets never hardcoded
7. **MongoDB Transactions**: Atomic operations
8. **XSS Prevention**: React escapes content

## Scalability Considerations

1. **Stateless Backend**: Can be horizontally scaled
2. **Database Ready**: MongoDB supports clustering
3. **Cron Flexibility**: Can be distributed
4. **Middleware Structure**: Easy to add logging/monitoring
5. **Component-Based Frontend**: Easy to code-split
6. **Service Layer**: Easy to extract microservices

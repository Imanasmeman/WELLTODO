# Quick Start Guide

Get up and running with the Daily Task Management System in 5 minutes.

## Prerequisites

- Node.js 16+
- MongoDB running on `mongodb://localhost:27017`

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The default `.env` is already configured for local development. If you want email notifications:

1. Enable 2FA on Gmail: https://myaccount.google.com/
2. Generate App Password: https://myaccount.google.com/security
3. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

## 3. Start MongoDB

```bash
mongod
```

(Leave this running in a separate terminal)

## 4. Start the Application

**Development mode (both backend and frontend)**:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 5. Create Your First Account

1. Go to http://localhost:5173
2. Click "Register"
3. Enter name, email, and password
4. Click "Register"
5. Start creating tasks!

## 6. Test the System

### Create a Task
- Click "Create New Task"
- Enter a title like "Test Task"
- Click "Create Task"

### Add Subtasks
- Click on the task card to expand it
- Type subtask name
- Click "Add"

### Update Task Status
- Expand the task
- Click "Edit"
- Change status to "In Progress" or "Completed"
- Click "Save"

### View History
- Click "History" in the navbar
- Select a past date
- See archived tasks from that day

## Production Deployment

### Build
```bash
npm run build
```

### Environment Variables

For production, update `.env`:

```
PORT=8000
NODE_ENV=production
MONGO_URI=<your-production-mongodb-uri>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-app-password>
CRON_TIME=59 23 * * *
JWT_SECRET=<use-a-long-random-string>
```

### Start Server
```bash
npm start
```

## Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -ti:5000

# Kill process
kill -9 <pid>
```

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env` is correct

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS in `.env`
- Ensure Gmail 2FA is enabled
- Check server logs for errors

### Can't Login/Register
- Clear browser localStorage: F12 > Application > Clear All
- Ensure backend is running: http://localhost:5000/api/users/profile
- Check network tab for errors

## Features Quick Overview

| Feature | Location | How-to |
|---------|----------|--------|
| Create Task | Today Board | Click "Create New Task" |
| Mark Complete | Task Card | Expand → Edit → Change Status |
| Add Subtask | Task Card | Expand → Type subtask → Add |
| View History | History Page | Select Date |
| Daily Summary | Email | Sent at 23:59 |
| Edit Task | Task Card | Expand → Edit |
| Delete Task | Task Card | Expand → Delete |

## API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/users/register | POST | Create account |
| /api/users/login | POST | Login |
| /api/tasks | POST | Create task |
| /api/tasks/today | GET | Get today's tasks |
| /api/tasks/history | GET | Get archived tasks |
| /api/tasks/:id | PUT | Update task |
| /api/tasks/:id | DELETE | Delete task |

## Next Steps

1. Explore the UI and create tasks
2. Check how the app handles subtasks
3. Review the README.md for detailed documentation
4. Customize email notifications (optional)
5. Set custom cron job time if needed

## Support

- Check README.md for detailed documentation
- Review server logs for errors
- Check browser console (F12) for frontend errors
- Verify MongoDB is running and accessible

Enjoy managing your tasks!

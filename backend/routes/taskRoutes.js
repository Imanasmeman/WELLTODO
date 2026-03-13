import express from 'express';
import {
  createTask,
  getTodayTasks,
  getTasksByDate,
  updateTask,
  deleteTask,
  addSubTask,
  updateSubTask,
  deleteSubTask,
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/auth.js';

authMiddleware


const router = express.Router();

router.use(authMiddleware);

router.post('/', createTask);
router.get('/today', getTodayTasks);
router.get('/history', getTasksByDate);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/subtask', addSubTask);
router.put('/:taskId/subtask/:subtaskId', updateSubTask);
router.delete('/:taskId/subtask/:subtaskId', deleteSubTask);

export default router;

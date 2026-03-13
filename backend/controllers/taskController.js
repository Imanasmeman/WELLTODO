import Task from '../models/Task.js';
import SubTask from '../models/SubTask.js';
import ArchivedTask from '../models/ArchivedTask.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getTodayRange, formatDate, getStartOfDay, getEndOfDay } from '../utils/dateUtils.js';
import DailySummary from '../models/DailySummary.js';

export const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;

  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }

  const task = new Task({
    title,
    description: description || '',
    userId,
  });

  await task.save();
  res.status(201).json({ success: true, data: task });
});

export const getTodayTasks = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { start, end } = getTodayRange();

  const tasks = await Task.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  }).populate('subTasks');

  res.status(200).json({ success: true, data: tasks });
});

export const getTasksByDate = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { date } = req.query;
  console.log(date)
  if (!date) {
    return res.status(400).json({ success: false, error: 'Date is required' });
  }

  const queryDate = new Date(date);
  const start = getStartOfDay(queryDate);
  const end = getEndOfDay(queryDate);

  const ArchivedTask = await ArchivedTask.find({
    userId,
    archivedAt: { $gte: start, $lte: end },
  });

  

  res.status(200).json({ success: true, data: ArchivedTask });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const userId = req.userId;

  const task = await Task.findOne({ _id: id, userId });

  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (status) task.status = status;
  if (status === 'Completed') task.completedAt = new Date();

  await task.save();
  await task.populate('subTasks');

  res.status(200).json({ success: true, data: task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const task = await Task.findOne({ _id: id, userId });

  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  await SubTask.deleteMany({ taskId: id });
  await Task.deleteOne({ _id: id });

  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});

export const addSubTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.userId;

  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, error: 'Subtask title is required' });
  }

  const task = await Task.findOne({ _id: id, userId });

  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  const subTask = new SubTask({
    title,
    taskId: id,
  });

  await subTask.save();
  task.subTasks.push(subTask._id);
  await task.save();

  res.status(201).json({ success: true, data: subTask });
});

export const updateSubTask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.params;
  const { title, status } = req.body;
  const userId = req.userId;

  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  const subTask = await SubTask.findOne({ _id: subtaskId, taskId });

  if (!subTask) {
    return res.status(404).json({ success: false, error: 'Subtask not found' });
  }

  if (title) subTask.title = title;
  if (status) subTask.status = status;

  await subTask.save();

  res.status(200).json({ success: true, data: subTask });
});

export const deleteSubTask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.params;
  const userId = req.userId;

  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  const subTask = await SubTask.findOneAndDelete({ _id: subtaskId, taskId });

  if (!subTask) {
    return res.status(404).json({ success: false, error: 'Subtask not found' });
  }

  task.subTasks = task.subTasks.filter((id) => id.toString() !== subtaskId);
  await task.save();

  res.status(200).json({ success: true, message: 'Subtask deleted successfully' });
});

import Task from '../models/Task.js';
import DailySummary from '../models/DailySummary.js';
import { getTodayRange, formatDate } from '../utils/dateUtils.js';

export const calculateDailySummary = async (userId) => {
  const { start, end } = getTodayRange();

  const tasks = await Task.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  });

  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPercentage,
    date: formatDate(new Date()),
  };
};

export const saveDailySummary = async (userId, summary) => {
  try {
    const dailySummary = new DailySummary({
      userId,
      date: new Date(),
      ...summary,
    });

    await dailySummary.save();
    console.log(`Daily summary saved for user: ${userId}`);
    return dailySummary;
  } catch (error) {
    console.error('Error saving daily summary:', error.message);
  }
};

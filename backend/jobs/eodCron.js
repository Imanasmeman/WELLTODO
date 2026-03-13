import cron from 'node-cron';
import Task from '../models/Task.js';
import SubTask from '../models/SubTask.js';
import ArchivedTask from '../models/ArchivedTask.js';
import User from '../models/User.js';
import { calculateDailySummary, saveDailySummary } from '../services/summaryService.js';
import { sendDailySummaryEmail } from '../services/emailService.js';
import { getTodayRange } from '../utils/dateUtils.js';
import mongoose from 'mongoose';

export const initializeEODCron = () => {
  const cronTime = process.env.CRON_TIME || '59 23 * * *';

  console.log(`EOD Cron job scheduled at: ${cronTime}`);

  cron.schedule(cronTime, async () => {
    console.log('EOD Job started at:', new Date().toISOString());

    try {
      const { start, end } = getTodayRange();

      const users = await User.find();

      for (const user of users) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const tasks = await Task.find({
            userId: user._id,
            createdAt: { $gte: start, $lte: end },
          }).session(session);

          if (tasks.length === 0) {
            await session.commitTransaction();
            continue;
          }

          const summary = await calculateDailySummary(user._id);
          await saveDailySummary(user._id, summary);

          for (const task of tasks) {
            if (task.status === 'In Progress') {
              task.status = 'Not Completed';
              await task.save({ session });
            }

            const subTasks = await SubTask.find({ taskId: task._id }).session(session);
            const subTaskData = subTasks.map((st) => ({
              title: st.title,
              status: st.status,
            }));

            const archivedTask = new ArchivedTask({
              originalTaskId: task._id,
              title: task.title,
              description: task.description,
              finalStatus: task.status,
              userId: user._id,
              subTasks: subTaskData,
              completedAt: task.completedAt,
            });

            await archivedTask.save({ session });
          }

          await Task.deleteMany(
            {
              userId: user._id,
              createdAt: { $gte: start, $lte: end },
            },
            { session }
          );

          await SubTask.deleteMany(
            {
              taskId: { $in: tasks.map((t) => t._id) },
            },
            { session }
          );

          await session.commitTransaction();

          const summaryData = {
            ...summary,
            generatedAt: new Date().toLocaleString(),
          };

          await sendDailySummaryEmail(user.email, user.name, summaryData);

          console.log(`EOD Job completed for user: ${user.email}`);
        } catch (error) {
          await session.abortTransaction();
          console.error(`Error processing EOD for user ${user._id}:`, error.message);
        } finally {
          await session.endSession();
        }
      }

      console.log('EOD Job completed successfully at:', new Date().toISOString());
    } catch (error) {
      console.error('EOD Job error:', error.message);
    }
  });
};

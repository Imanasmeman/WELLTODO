import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Not Completed'],
      default: 'Pending',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTask',
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.index({ createdAt: 1 });
taskSchema.index({ userId: 1 });
taskSchema.index({ status: 1 });

export default mongoose.model('Task', taskSchema);

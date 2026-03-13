import mongoose from 'mongoose';

const subTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a subtask title'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('SubTask', subTaskSchema);

import mongoose from 'mongoose';

const archivedTaskSchema = new mongoose.Schema(
  {
    originalTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    finalStatus: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Not Completed'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subTasks: [
      {
        title: String,
        status: String,
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

archivedTaskSchema.index({ userId: 1 });
archivedTaskSchema.index({ archivedAt: 1 });

export default mongoose.model('ArchivedTask', archivedTaskSchema);

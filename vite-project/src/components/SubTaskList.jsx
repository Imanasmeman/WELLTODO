import { Trash2, Check } from 'lucide-react';
import { useTasks } from '../hooks/useTasks.js';

export default function SubTaskList({ task }) {
  const { updateSubTask, deleteSubTask } = useTasks();

  if (!task.subTasks || task.subTasks.length === 0) {
    return <p className="text-sm text-gray-500 italic">No subtasks yet</p>;
  }

  const toggleSubTaskStatus = (subtask) => {
    const newStatus = subtask.status === 'Pending' ? 'Completed' : 'Pending';
    updateSubTask(task._id, subtask._id, { status: newStatus });
  };

  return (
    <div className="space-y-2 mb-4">
      <h4 className="font-semibold text-sm text-gray-700">Subtasks:</h4>
      {task.subTasks.map((subtask) => (
        <div
          key={subtask._id}
          className={`flex items-center gap-3 p-2 rounded border ${
            subtask.status === 'Completed'
              ? 'bg-green-50 border-green-200'
              : 'bg-gray-100 border-gray-200'
          }`}
        >
          <button
            onClick={() => toggleSubTaskStatus(subtask)}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
              subtask.status === 'Completed'
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {subtask.status === 'Completed' && <Check className="w-3 h-3 text-white" />}
          </button>
          <span
            className={`flex-1 text-sm ${
              subtask.status === 'Completed'
                ? 'line-through text-gray-500'
                : 'text-gray-800'
            }`}
          >
            {subtask.title}
          </span>
          <button
            onClick={() => deleteSubTask(task._id, subtask._id)}
            className="p-1 text-red-500 hover:bg-red-100 rounded transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

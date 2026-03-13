import { useState } from 'react';
import { Trash2, CreditCard as Edit2, ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';
import { useTasks } from '../hooks/useTasks.js';
import SubTaskList from './SubTaskList.jsx';

export default function TaskCard({ task }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newSubTask, setNewSubTask] = useState('');
  const [editedStatus, setEditedStatus] = useState(task.status);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const { updateTask, deleteTask, addSubTask } = useTasks();

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    'Not Completed': 'bg-red-100 text-red-800',
  };

  const handleSaveEdit = async () => {
    if (editedTitle.trim()) {
      await updateTask(task._id, {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus,
      });
      setEditing(false);
    }
  };

  const handleAddSubTask = async () => {
    if (newSubTask.trim()) {
      await addSubTask(task._id, newSubTask);
      setNewSubTask('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-500 mb-4">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-lg font-semibold mb-2 w-full px-2 py-1 border rounded"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
            )}
            {editing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="text-gray-600 text-sm w-full px-2 py-1 border rounded mb-2"
                rows="2"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              task.description && (
                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
              )
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {editing ? (
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Not Completed</option>
            </select>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
              {task.status}
            </span>
          )}
          {task.subTasks && task.subTasks.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {task.subTasks.length} subtasks
            </span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t bg-gray-50 p-4">
          <SubTaskList task={task} />

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add new subtask..."
              value={newSubTask}
              onChange={(e) => setNewSubTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubTask()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddSubTask}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => handleSaveEdit()}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-medium flex items-center justify-center gap-2 transition"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded font-medium transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-medium flex items-center justify-center gap-2 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded font-medium flex items-center justify-center gap-2 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

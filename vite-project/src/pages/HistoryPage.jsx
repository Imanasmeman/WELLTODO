import { useState, useEffect } from 'react';
import { Loader, Calendar } from 'lucide-react';
import { taskAPI } from '../services/api.js';

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasksForDate(selectedDate);
  }, [selectedDate]);

  const fetchTasksForDate = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.getTasksByDate(date);
      setTasks(response.data.data || []);
      console.log(tasks)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    'Not Completed': 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Task History</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6 text-blue-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex-1"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-sm text-gray-600">
            Showing archived tasks from <span className="font-semibold">{selectedDate}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        <div>
          {tasks.length === 0 && !loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">No tasks found for {selectedDate}</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-500 mb-4 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.finalStatus]}`}
                      >
                        {task.finalStatus}
                      </span>
                      {task.subTasks && task.subTasks.length > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {task.subTasks.length} subtasks
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500">
                      Archived: {new Date(task.archivedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {task.subTasks && task.subTasks.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Subtasks:</h4>
                    <div className="space-y-2">
                      {task.subTasks.map((subtask, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div
                            className={`w-4 h-4 rounded border-2 ${
                              subtask.status === 'Completed'
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}
                          />
                          <span
                            className={
                              subtask.status === 'Completed'
                                ? 'line-through text-gray-500'
                                : 'text-gray-800'
                            }
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

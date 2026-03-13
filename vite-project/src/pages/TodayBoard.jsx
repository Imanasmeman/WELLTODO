import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import TaskForm from '../components/TaskForm.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { useTasks } from '../hooks/useTasks.js';

export default function TodayBoard() {
  const { tasks, loading, error, fetchTodayTasks } = useTasks();

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Today's Tasks</h1>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Completion</p>
              <p className="text-3xl font-bold text-purple-600">{completionPercentage}%</p>
            </div>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        <TaskForm />

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div>
          {tasks.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tasks for today. Create your first task!</p>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task._id} task={task} />)
          )}
        </div>
      </div>
    </div>
  );
}

import { createContext, useState, useCallback } from 'react';
import { taskAPI } from '../services/api.js';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodayTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.getTodayTasks();
      setTasks(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (title, description) => {
    try {
      const response = await taskAPI.createTask({ title, description });
      setTasks([...tasks, response.data.data]);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
      throw err;
    }
  }, [tasks]);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const response = await taskAPI.updateTask(id, updates);
      setTasks(tasks.map((t) => (t._id === id ? response.data.data : t)));
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
      throw err;
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
      throw err;
    }
  }, [tasks]);

  const addSubTask = useCallback(async (taskId, title) => {
    try {
      const response = await taskAPI.addSubTask(taskId, { title });
      setTasks(
        tasks.map((t) =>
          t._id === taskId
            ? { ...t, subTasks: [...t.subTasks, response.data.data] }
            : t
        )
      );
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add subtask');
      throw err;
    }
  }, [tasks]);

  const updateSubTask = useCallback(async (taskId, subtaskId, updates) => {
    try {
      const response = await taskAPI.updateSubTask(taskId, subtaskId, updates);
      setTasks(
        tasks.map((t) =>
          t._id === taskId
            ? {
                ...t,
                subTasks: t.subTasks.map((st) =>
                  st._id === subtaskId ? response.data.data : st
                ),
              }
            : t
        )
      );
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update subtask');
      throw err;
    }
  }, [tasks]);

  const deleteSubTask = useCallback(async (taskId, subtaskId) => {
    try {
      await taskAPI.deleteSubTask(taskId, subtaskId);
      setTasks(
        tasks.map((t) =>
          t._id === taskId
            ? {
                ...t,
                subTasks: t.subTasks.filter((st) => st._id !== subtaskId),
              }
            : t
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete subtask');
      throw err;
    }
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTodayTasks,
        createTask,
        updateTask,
        deleteTask,
        addSubTask,
        updateSubTask,
        deleteSubTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

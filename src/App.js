import React, { useState, useEffect } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  // Load tasks from Flask backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchTodos();
        setTasks(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Add task through Flask
  const addTask = async (text, dueDate) => {
    try {
      const newTask = await addTodo({
        text,
        dueDate: dueDate || null,
        completed: false
      });
      setTasks([newTask, ...tasks]);
    } catch (err) {
      console.error("Failed to add task:", err);
      setError("Failed to add task. Please try again.");
    }
  };

  // Update task through Flask
  const updateTask = async (id, updates) => {
    try {
      await updateTodo(id, updates);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  // Delete task through Flask
  const deleteTask = async (id) => {
    try {
      await deleteTodo(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  // Clear completed tasks
  const clearCompleted = async () => {
    try {
      await Promise.all(
        tasks
          .filter(task => task.completed)
          .map(task => deleteTodo(task.id))
      );
      setTasks(tasks.filter(task => !task.completed));
    } catch (err) {
      console.error("Failed to clear completed tasks:", err);
      setError("Failed to clear completed tasks. Please try again.");
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="container">
        <header className="app-header">
          <h1>TaskFlow</h1>
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        <div className="app-content">
          {error && <div className="error-message">{error}</div>}
          
          <TaskForm onAdd={addTask} darkMode={darkMode} />
          
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <div className="task-board">
              <div className="task-columns">
                <div className="task-list-container">
                  <ul className="task-list">
                    {filteredTasks.map(task => (
                      <Task
                        key={task.id}
                        task={task}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                        darkMode={darkMode}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tasks.length > 0 && (
            <TaskFilters
              filter={filter}
              setFilter={setFilter}
              onClearCompleted={clearCompleted}
              activeCount={tasks.filter(t => !t.completed).length}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
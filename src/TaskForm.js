import React, { useState } from 'react';

const TaskForm = ({ onAdd }) => {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input, dueDate);
    setInput('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form-container">
      <div className="input-group">
        <label htmlFor="task-input" className="input-label">
          Add New Task
        </label>
        <div className="input-wrapper">
          <input
            id="task-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done today?"
            className="task-input"
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
            min={new Date().toISOString().split('T')[0]}
          />
          <button type="submit" className="add-task-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const Task = ({ task, onUpdate, onDelete, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'TASK',
    hover: (item) => {
      if (item.id !== task.id) {
        onUpdate(item.id, { position: task.position });
      }
    },
  }));

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  const handleSave = () => {
    onUpdate(task.id, { text: editText });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  const toggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };


  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    : null;

  return (
    <li 
      ref={(node) => drag(drop(node))}
      className={`task-item ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="task-content">
        <button 
          onClick={toggleComplete}
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        >
          {task.completed && (
            <svg viewBox="0 0 24 24" className="checkmark">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </button>
        
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="task-edit-input"
          />
        ) : (
          <div className="task-text-container" style={{ display: 'flex', alignItems: 'center' }}>
            <span className="task-text" onClick={toggleComplete}>
              {task.text}
            </span>
            {/* Date display with guaranteed visibility */}
            {formattedDate && (
              <span style={{
                marginLeft: '8px',
                color: darkMode ? '#a0aec0' : '#718096',
                fontSize: '0.85rem',
                fontWeight: 500,
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.7 : 1
              }}>
                {formattedDate}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="task-actions">
        {!task.completed && !isEditing && (
          <button onClick={handleEdit} className="task-edit-btn">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        )}
        <button onClick={() => onDelete(task.id)} className="task-delete-btn">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </li>
  );
};

export default Task;
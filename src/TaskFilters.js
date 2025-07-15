import React from 'react';

const TaskFilters = ({ filter, setFilter, onClearCompleted }) => {

return (
  <div className="filter-buttons">
    <button 
      className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
      onClick={() => setFilter('all')}
    >
      All Tasks
    </button>
    <button 
      className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
      onClick={() => setFilter('active')}
    >
      Active
    </button>
    <button 
      className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
      onClick={() => setFilter('completed')}
    >
      Completed
    </button>
  </div>
);
};

export default TaskFilters;
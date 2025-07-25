import React from 'react';
import ReactDOM from 'react-dom/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <div className="app-background">
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </div>
  </React.StrictMode>
);

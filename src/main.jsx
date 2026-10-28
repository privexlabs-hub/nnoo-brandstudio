import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/tokens.css';
import './styles/dark.css';
import './styles/base.css';
import App from './App.jsx';
import { initTheme } from './lib/app.js';

initTheme();
createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);

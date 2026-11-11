import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fonts are bundled from npm so the deployed site makes no external requests.
// "standard" includes the weight, width and optical size axes for the display face.
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/instrument-sans/index.css';

import './styles/tokens.css';
import './styles/base.css';

import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

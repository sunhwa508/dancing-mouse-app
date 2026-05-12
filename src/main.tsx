import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import OverlayApp from './OverlayApp';

const isOverlay = new URLSearchParams(window.location.search).has('overlay');
const Root = isOverlay ? OverlayApp : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

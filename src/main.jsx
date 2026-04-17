import './index.css';
import { render } from 'preact';
import { App } from './app.jsx';

console.log('Main: Starting render...');
try {
  const root = document.getElementById('app');
  if (!root) throw new Error('Root element #app not found');
  render(<App />, root);
  console.log('Main: Render called successfully');
} catch (e) {
  console.error('Main: Render failed', e);
}

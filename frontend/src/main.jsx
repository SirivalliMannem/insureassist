import { createRoot } from 'react-dom/client';
import App from './App';
import { installLegacyBridge } from './runtime/legacyBridge';
import './styles/style.css';

installLegacyBridge();
createRoot(document.getElementById('root')).render(<App />);

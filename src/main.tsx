import './styles/fonts.css';
import './styles/tokens.css';
import './styles/reset.css';
import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Example } from './examples/Example';
import { ColorSchemesPage } from './examples/ColorSchemesPage';

function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (hash.startsWith('#/color-schemes')) {
    return <ColorSchemesPage />;
  }
  return <Example />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

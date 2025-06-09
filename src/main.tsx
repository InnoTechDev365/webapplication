
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfills for older browsers
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 16);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}

// Error boundary for React
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>Please refresh the page to continue.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wait for DOM to be ready
function initializeApp() {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  // Mark the app as loaded for React components
  rootElement.classList.add('react-app');

  const root = createRoot(rootElement);
  
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );

  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 300);
    }
  }, 500);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

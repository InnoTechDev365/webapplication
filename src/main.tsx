
import React from 'react'
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
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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

// GitHub Pages routing fix
function handleGitHubPagesRouting() {
  const search = window.location.search;
  if (search && search.indexOf('?/') === 0) {
    const decoded = search.slice(2).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    
    window.history.replaceState(null, null,
      window.location.pathname + decoded + window.location.hash
    );
  }
}

// Wait for DOM to be ready
function initializeApp() {
  // Handle GitHub Pages routing first
  handleGitHubPagesRouting();
  
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

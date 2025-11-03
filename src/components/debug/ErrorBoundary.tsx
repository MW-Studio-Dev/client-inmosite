'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 ErrorBoundary caught an error:', error);
    console.error('🔴 Component Stack:', errorInfo.componentStack);

    // Log detallado para debugging
    console.group('🔍 Error Details');
    console.log('Error Name:', error.name);
    console.log('Error Message:', error.message);
    console.log('Error Stack:', error.stack);
    console.log('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    this.setState({
      error,
      errorInfo
    });

    // Llamar callback opcional
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Oops! Algo salió mal
              </h1>
              <p className="text-gray-600">
                Se ha producido un error inesperado. Por favor, intenta recargar la página.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-lg font-semibold text-red-900 mb-2">
                  Debug Info (Development Only)
                </h2>
                <div className="text-sm text-red-800 mb-4">
                  <p className="font-mono">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                </div>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-semibold text-red-900 hover:text-red-700">
                      Ver Stack Trace
                    </summary>
                    <pre className="mt-2 p-2 bg-red-100 rounded overflow-x-auto text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Recargar Página
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Volver Atrás
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

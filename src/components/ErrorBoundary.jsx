import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ApexTrader caught unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#121721] border border-rose-900/50 rounded-xl p-6 text-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-100 mb-2">
              Something went wrong
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              An unexpected error occurred while rendering this view.
              {this.state.error?.message && (
                <span className="block mt-2 font-mono text-[11px] p-2 bg-slate-950/60 rounded text-rose-400 overflow-x-auto text-left">
                  {this.state.error.message}
                </span>
              )}
            </p>
            <div className="flex gap-3 justify-center">
              <Button size="sm" variant="secondary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { Component } from "preact";
import { ErrorInterceptor } from "../services/error-interceptor.ts";

interface Props {
  component?: string;
  children: preact.ComponentChildren;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Intercept and analyze the error
    ErrorInterceptor.getInstance().handleError(error, {
      timestamp: new Date(),
      component: this.props.component || 'unknown',
      severity: 'high',
      tags: ['frontend', 'react', this.props.component || 'unknown']
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div class="p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 class="text-lg font-semibold text-red-800">Something went wrong</h2>
          <p class="mt-2 text-red-600">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

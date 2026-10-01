import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isChunkLoadError } from "@/lib/lazyWithRetry";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isLoadingError: boolean;
}

class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isLoadingError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, isLoadingError: isChunkLoadError(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("Page rendering failed", error, info.componentStack);
  }

  private reload = () => {
    sessionStorage.clear();
    const freshUrl = new URL(window.location.href);
    freshUrl.searchParams.set("refresh", Date.now().toString());
    window.location.replace(freshUrl.toString());
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-background px-6 flex items-center justify-center">
        <div className="max-w-md text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">Punarvsu</p>
          <h1 className="font-display text-3xl text-foreground mb-4">
            {this.state.isLoadingError ? "A fresh version is ready" : "This page needs a refresh"}
          </h1>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            Refresh once to load the latest version of the collection.
          </p>
          <Button type="button" size="lg" onClick={this.reload}>
            <RefreshCw aria-hidden="true" />
            Reload page
          </Button>
        </div>
      </main>
    );
  }
}

export default AppErrorBoundary;
# Architecture decisions

- All dynamic React imports use `lazyWithRetry` and render inside `AppErrorBoundary`, preventing stale deployment chunks from leaving a blank screen.
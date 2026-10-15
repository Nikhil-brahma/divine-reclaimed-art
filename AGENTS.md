# Architecture decisions

- All dynamic React imports use `lazyWithRetry` and render inside `AppErrorBoundary`, preventing stale deployment chunks from leaving a blank screen.
- Custom-order requests use a dedicated public-submission table with editor-only reads and client/database validation to keep shopper details private.
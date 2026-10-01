# Prevent stale page chunks from causing a blank screen

## Changes
- Add a shared safe lazy-loader that detects failed JavaScript chunk downloads and performs one cache-busting page refresh.
- Replace the app’s route and homepage dynamic imports with the safe loader, including the collections section.
- Add a final recovery screen with a Reload button if the asset remains unavailable, preventing a blank page and refresh loops.
- Preserve the current visual design, page order, deferred rendering, and performance behavior.

## Verification
- Confirm the app builds cleanly and existing tests pass.
- Simulate a failed dynamic import and verify one automatic refresh followed by the visible recovery screen rather than a blank page.
- Open the homepage and product collection in the preview to confirm normal loading still works.

## Technical details
The reported hashed file belongs to an older deployment. When a browser retains old page code after a new deployment removes that hashed file, a normal dynamic import cannot recover. The loader will recognize this deployment mismatch, request fresh page HTML once with a cache-busting URL, and safely stop retrying if the network or deployment still cannot serve the asset.

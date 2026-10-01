import { lazy, type ComponentType, type LazyExoticComponent } from "react";

const RELOAD_KEY = "punarvsu:chunk-reload";
const RELOAD_COOLDOWN_MS = 30_000;

export const isChunkLoadError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk [\d]+ failed|ChunkLoadError/i.test(message);
};

export const lazyWithRetry = <T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
): LazyExoticComponent<T> =>
  lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      const previousReload = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
      const canReload = Date.now() - previousReload > RELOAD_COOLDOWN_MS;
      if (isChunkLoadError(error) && canReload) {
        sessionStorage.setItem(RELOAD_KEY, Date.now().toString());
        const freshUrl = new URL(window.location.href);
        freshUrl.searchParams.set("refresh", Date.now().toString());
        window.location.replace(freshUrl.toString());
        return new Promise<never>(() => undefined);
      }

      throw error;
    }
  });
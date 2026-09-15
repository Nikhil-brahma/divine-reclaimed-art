type CacheEntry<T> = { value?: T; promise?: Promise<T>; expiresAt: number };

const cache = new Map<string, CacheEntry<unknown>>();

export const cachedPublicRequest = <T>(key: string, loader: () => Promise<T>, ttlMs = 60_000): Promise<T> => {
  const now = Date.now();
  const existing = cache.get(key) as CacheEntry<T> | undefined;
  if (existing?.value !== undefined && existing.expiresAt > now) return Promise.resolve(existing.value);
  if (existing?.promise) return existing.promise;

  const promise = loader().then((value) => {
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
    return value;
  }).catch((error) => {
    cache.delete(key);
    throw error;
  });

  cache.set(key, { promise, expiresAt: now + ttlMs });
  return promise;
};

export const invalidatePublicCache = (prefix: string) => {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
};
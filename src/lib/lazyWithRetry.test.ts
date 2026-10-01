import { describe, expect, it } from "vitest";
import { isChunkLoadError } from "@/lib/lazyWithRetry";

describe("isChunkLoadError", () => {
  it("recognizes failed dynamic module downloads", () => {
    expect(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: /assets/page-old.js"))).toBe(true);
  });

  it("does not treat ordinary rendering errors as stale chunks", () => {
    expect(isChunkLoadError(new Error("Cannot read properties of undefined"))).toBe(false);
  });
});
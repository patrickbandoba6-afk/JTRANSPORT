import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    // Tests share one SQLite file; run test files sequentially to avoid
    // cross-file state pollution and write contention.
    fileParallelism: false,
  },
});

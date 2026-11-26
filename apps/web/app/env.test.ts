// @vitest-environment node
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

test.each(["", "maintainer-org/synthetic.factory"])(
  "accepts optional workflow repository %j",
  async (repository) => {
    vi.stubEnv("FACTORY_GITHUB_REPOSITORY", repository);
    const { env } = await import("./env");
    expect(env.FACTORY_GITHUB_REPOSITORY).toBe(repository || undefined);
  },
);

test.each(["https://github.com/org/repo", "org/..", "org/repo?ref=main"])(
  "rejects invalid workflow repository %j",
  async (repository) => {
    vi.stubEnv("FACTORY_GITHUB_REPOSITORY", repository);
    await expect(import("./env")).rejects.toThrow(
      "Invalid environment variables",
    );
  },
);

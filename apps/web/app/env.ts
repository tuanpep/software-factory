import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    FACTORY_GITHUB_REPOSITORY: z
      .string()
      .regex(/^[a-z\d]+(?:-[a-z\d]+)*\/(?!\.{1,2}$)[a-z\d._-]+$/i, {
        message: "Use a GitHub repository in OWNER/REPO format.",
      })
      .optional(),
  },
  client: {},
  experimental__runtimeEnv: {},
  emptyStringAsUndefined: true,
});

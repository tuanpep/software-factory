# Forms (Zod 4 + Mantine)

[placement](placement.md) · [boundaries](boundaries.md) · [layout](layout.md#record-feature)

## Dependency

Add **`mantine-form-zod-resolver`** when the first validated feature form ships (`npm run check` after install). Do not import `zod4Resolver` until that package is in `package.json`.

```tsx
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

import { bugReportSchema } from "../domain/schema";
```

Schema lives in `features/<slice>/domain/` (e.g. `schema.ts` or next to `state.ts`). Server action re-parses with the same schema; client resolver is optional UX only.

## Flow

Draft stays in `useForm` until portal or `actions.ts` confirms. Expected validation errors: return values from the action, not throws ([boundaries](boundaries.md)).

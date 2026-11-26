import { parseAsStringLiteral } from "nuqs";

import { ATTENTION_FILTERS } from "./attention";

export const attentionFilterParser =
  parseAsStringLiteral(ATTENTION_FILTERS).withDefault("all");

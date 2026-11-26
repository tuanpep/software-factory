import { createLoader } from "nuqs/server";
import { expect, test } from "vitest";

import { attentionFilterParser } from "./search-params";

const loadSearchParams = createLoader({
  view: attentionFilterParser,
});

test("defaults the run view to all", () => {
  expect(loadSearchParams({})).toEqual({ view: "all" });
});

test("reads a known run view", () => {
  expect(loadSearchParams({ view: "ready" })).toEqual({ view: "ready" });
});

test("falls back when the run view is unknown", () => {
  expect(loadSearchParams({ view: "nope" })).toEqual({ view: "all" });
});

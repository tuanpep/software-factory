import { createLoader, parseAsString } from "nuqs/server";
import { expect, test } from "vitest";

const loadSearchParams = createLoader({
  q: parseAsString.withDefault(""),
});

test("uses an empty query when the URL has none", () => {
  expect(loadSearchParams({})).toEqual({ q: "" });
});

test("reads the query from search params", () => {
  expect(loadSearchParams({ q: "portal" })).toEqual({ q: "portal" });
});

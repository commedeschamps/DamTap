import { parseAsBoolean, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs/server";
import { PRICE_LIMIT } from "./catalogue";

export const catalogueParsers = {
  q: parseAsString.withDefault(""),
  category: parseAsStringLiteral(["all", "ready", "bakery", "fruits", "dairy", "meat", "groceries", "drinks"] as const).withDefault("all"),
  district: parseAsString.withDefault(""),
  max: parseAsInteger.withDefault(PRICE_LIMIT),
  sort: parseAsStringLiteral(["recommended", "price", "ending", "discount"] as const).withDefault("recommended"),
  favorites: parseAsBoolean.withDefault(false),
  soon: parseAsBoolean.withDefault(false),
  view: parseAsStringLiteral(["list", "map"] as const).withDefault("list"),
};

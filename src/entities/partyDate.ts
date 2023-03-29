import { Err, Ok } from "../util/result.ts";

export type PartyDate = Date & { readonly _: unique symbol };

function varifyPartyDate(date: Date): date is PartyDate {
  return Date.now() > date.getTime();
}

export function createPartyDate(date: Date) {
  if (varifyPartyDate(date)) {
    return Ok(date);
  }
  return Err<PartyDate>(new Error(`invalid PertyDate: "${date}"`));
}

import { Err, Ok } from "../util/result.ts";

export type PartyName = string & { readonly _: unique symbol };

function varifyPartyName(name: string): name is PartyName {
  return name !== "";
}

export function createPartyName(name: string) {
  if (varifyPartyName(name)) {
    return Ok(name);
  }
  return Err<PartyName>(new Error(`invalid PertyName: "${name}"`));
}

import { Err, Ok } from "../util/result.ts";

export type BillingAmount = number & { readonly _: unique symbol };

function varifyBillingAmount(amount: number): amount is BillingAmount {
  return 0 < amount && amount % 10 === 0;
}

export function createBillingAmount(amount: number) {
  if (varifyBillingAmount(amount)) {
    return Ok(amount);
  }
  return Err<BillingAmount>(
    new Error(`invalid createBillingAmount: ${amount}`),
  );
}

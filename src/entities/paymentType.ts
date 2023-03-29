import { Err, Ok } from "../util/result.ts";
import { type ValueOf } from "../util/type.ts";

export const PAYMENT_TYPE = {
  LARGE: "LARGE",
  MEDIUM: "MEDIUM",
  SMALL: "SMALL",
} as const satisfies Record<string, string>;

export type PaymentType = ValueOf<typeof PAYMENT_TYPE>;

export type PaymentTypeRatio = number & { readonly _: unique symbol };

function varifyPaymentTypeRatio(ratio: number): ratio is PaymentTypeRatio {
  return 0.1 <= ratio && ratio <= 2.0;
}

export function createPaymentTypeRatio(ratio: number) {
  if (varifyPaymentTypeRatio(ratio)) {
    return Ok(ratio);
  }
  return Err<PaymentTypeRatio>(new Error(`invalid PaymentTypeRatio: ${ratio}`));
}

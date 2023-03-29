import { Err, Ok, Result } from "../util/result.ts";
import { Party } from "./party.ts";
import { PAYMENT_TYPE, PaymentType } from "./paymentType.ts";

type Warikan = {
  amountBy: {
    [P in PaymentType]: number;
  };
  balance: number;
};

export function warikan(party: Party): Result<Warikan> {
  const { billingAmount, members, paymentTypeRatios } = party;

  if (members.length === 0) {
    return Err(new Error("Party member is empty"));
  }

  if (paymentTypeRatios === undefined) {
    const amount = Math.ceil(billingAmount / members.length);
    const balance = billingAmount - amount * members.length;
    return Ok({
      amountBy: {
        LARGE: amount,
        MEDIUM: amount,
        SMALL: amount,
      },
      balance,
    });
  }

  const larges =
    members.filter((m) => m.paymentType === PAYMENT_TYPE.LARGE).length;
  const meduims =
    members.filter((m) => m.paymentType === PAYMENT_TYPE.MEDIUM).length;
  const smalls =
    members.filter((m) => m.paymentType === PAYMENT_TYPE.SMALL).length;

  const mediumAmount = Math.ceil(
    billingAmount /
      (meduims + paymentTypeRatios.large * larges +
        paymentTypeRatios.small * smalls),
  );
  const largeAmount = Math.ceil(mediumAmount * paymentTypeRatios.large);
  const smallAmount = Math.ceil(mediumAmount * paymentTypeRatios.small);
  const balance =
    (mediumAmount * meduims + largeAmount * larges + smallAmount * smalls) -
    billingAmount;

  return Ok({
    amountBy: {
      LARGE: largeAmount,
      MEDIUM: mediumAmount,
      SMALL: smallAmount,
    },
    balance,
  });
}

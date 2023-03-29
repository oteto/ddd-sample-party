import { Err, isError, Ok, type Result } from "../util/result.ts";
import { type BillingAmount, createBillingAmount } from "./billingAmount.ts";
import { createPartyDate, type PartyDate } from "./partyDate.ts";
import { type PartyMember } from "./partyMember.ts";
import { createPartyName, type PartyName } from "./partyName.ts";
import {
  createPaymentTypeRatio,
  type PaymentTypeRatio,
} from "./paymentType.ts";

export type Party = {
  name: PartyName;
  date: PartyDate;
  members: PartyMember[];
  billingAmount: BillingAmount;
  paymentTypeRatios?: {
    small: PaymentTypeRatio;
    large: PaymentTypeRatio;
  };
};

export function createParty(
  { name, date, billingAmount }: {
    name: string;
    date: Date;
    billingAmount: number;
  },
): Result<Party> {
  const result = createPartyName(name)
    .andThen((name) => createPartyDate(date).map((date) => ({ name, date })))
    .andThen((props) =>
      createBillingAmount(billingAmount).map((billingAmount) => ({
        ...props,
        billingAmount,
      }))
    );

  if (isError(result)) {
    return Err(
      new Error(`failed to createPerty`, { cause: result.error }),
    );
  }

  return Ok({
    ...result.unwrap(),
    members: [],
  });
}

export function withMembers(
  party: Party,
  ...members: PartyMember[]
): Result<Party> {
  return Ok({
    ...party,
    members: [...party.members, ...members],
  });
}

export function withPaymentTypeRatios(
  party: Party,
  { small, large }: { small: number; large: number },
): Result<Party> {
  const smallRatio = createPaymentTypeRatio(small);
  const largeRatio = createPaymentTypeRatio(large);

  if (isError(smallRatio)) {
    return Err(
      new Error(`failed to createPaymentTypeRatio`, {
        cause: smallRatio.error,
      }),
    );
  }
  if (isError(largeRatio)) {
    return Err(
      new Error(`failed to createPaymentTypeRatio`, {
        cause: largeRatio.error,
      }),
    );
  }

  return Ok({
    ...party,
    paymentTypeRatios: {
      small: smallRatio.unwrap(),
      large: largeRatio.unwrap(),
    },
  });
}

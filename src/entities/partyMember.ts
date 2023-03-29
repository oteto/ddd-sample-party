import { type PartyName } from "./partyName.ts";
import { type PaymentType } from "./paymentType.ts";

type PartyMemberID = `${PartyName}-${number}`;

export type PartyMember = {
  id: PartyMemberID;
  name: string;
  paymentType: PaymentType;
};

export function createPatyMember(
  { partyName, name, paymentType, id }: {
    partyName: PartyName;
    id: number;
    name: string;
    paymentType: PaymentType;
  },
) {
  return {
    id: `${partyName}-${id}`,
    name,
    paymentType,
  } satisfies PartyMember;
}

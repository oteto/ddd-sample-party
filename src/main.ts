import {
  createParty,
  withMembers,
  withPaymentTypeRatios,
} from "./entities/party.ts";
import { createPatyMember } from "./entities/partyMember.ts";
import { PAYMENT_TYPE } from "./entities/paymentType.ts";
import { warikan } from "./entities/warikan.ts";

function main() {
  const party = createParty({
    name: "飲み会",
    date: new Date("2023-03-01"),
    billingAmount: 10000,
  })
    .andThen((p) =>
      withMembers(
        p,
        createPatyMember({
          partyName: p.name,
          id: 1,
          name: "hoge",
          paymentType: PAYMENT_TYPE.LARGE,
        }),
        createPatyMember({
          partyName: p.name,
          id: 2,
          name: "foo",
          paymentType: PAYMENT_TYPE.LARGE,
        }),
        createPatyMember({
          partyName: p.name,
          id: 3,
          name: "bar",
          paymentType: PAYMENT_TYPE.MEDIUM,
        }),
        createPatyMember({
          partyName: p.name,
          id: 4,
          name: "fuga",
          paymentType: PAYMENT_TYPE.SMALL,
        }),
        createPatyMember({
          partyName: p.name,
          id: 5,
          name: "piyo",
          paymentType: PAYMENT_TYPE.MEDIUM,
        }),
      )
    ).andThen((p) => withPaymentTypeRatios(p, { small: 0.8, large: 1.2 }));

  party.andThen((p) => warikan(p).map((w) => ({ p, w }))).match({
    ok: ({ p, w }) => {
      console.log(
        "+===============================================================================+",
      );
      p.members.forEach((m) =>
        console.log(
          `  ${m.name}\tさんの支払額は ${w.amountBy[m.paymentType]} 円です。`,
        )
      );
      console.log();
      console.log(
        `  今回の飲み会の請求金額は ${p.billingAmount} 円ですので、お釣りは ${w.balance} 円となります。`,
      );
      console.log(
        "+===============================================================================+",
      );
    },
    err: console.error,
  });
}

if (import.meta.main) {
  main();
}

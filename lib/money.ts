export type Currency = "EUR" | "USD" | "GBP" | "JPY";

export type Money = {
  amountMinor: number;
  currency: Currency;
};

export const currencyMinorUnits: Record<Currency, number> = {
  EUR: 2,
  USD: 2,
  GBP: 2,
  JPY: 0
};

export function money(amountMinor: number, currency: Currency): Money {
  if (!Number.isInteger(amountMinor)) throw new Error("Money must use integer minor units");
  return { amountMinor, currency };
}

export function assertSameCurrency(a: Money, b: Money) {
  if (a.currency !== b.currency) throw new Error(`Currency mismatch ${a.currency}/${b.currency}`);
}

export function add(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amountMinor + b.amountMinor, a.currency);
}

export function subtract(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amountMinor - b.amountMinor, a.currency);
}

export function mulBpsRoundUp(base: Money, bps: number): Money {
  return money(Math.ceil((base.amountMinor * bps) / 10000), base.currency);
}

export function mulBpsRoundNearest(base: Money, bps: number): Money {
  return money(Math.round((base.amountMinor * bps) / 10000), base.currency);
}

export function formatMoney(value: Money): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: value.currency,
    minimumFractionDigits: currencyMinorUnits[value.currency],
    maximumFractionDigits: currencyMinorUnits[value.currency]
  }).format(value.amountMinor / 10 ** currencyMinorUnits[value.currency]);
}

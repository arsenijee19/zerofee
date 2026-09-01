# Pricing Engine

`lib/domain/pricing.ts` implements:
- current pricing rule selection;
- guarantee eligibility profile selection;
- tax-inclusive and tax-exclusive handling;
- provider cost calculation with percentage, fixed, billing, cross-border, and FX components;
- integer minor-unit binary search for the lowest buyer retail amount satisfying the creator target;
- minimality testing by reducing retail by one minor unit.

No binary floating point is used for money.

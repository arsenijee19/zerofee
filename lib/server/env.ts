import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url().default("postgresql://127.0.0.1:5432/zerofee"),
  RUNTIME_MODE: z.enum(["development", "test", "production", "demo"]).default("development"),
  AUTH_SECRET: z.string().min(12).default("dev-only-change-me"),
  CREATOR_PAYMENTS_PROVIDER: z.enum(["mock", "stripe"]).default("mock"),
  PLATFORM_BILLING_PROVIDER: z.enum(["mock", "stripe"]).default("mock"),
  TAX_PROVIDER: z.enum(["mock", "stripe_tax", "disabled"]).default("mock"),
  STRIPE_SECRET_KEY: z.string().optional().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(""),
  APP_URL: z.string().url().default("http://localhost:3000")
});

export function getEnv() {
  const env = schema.parse(process.env);
  if (process.env.NODE_ENV === "production") {
    if (env.AUTH_SECRET === "dev-only-change-me") throw new Error("AUTH_SECRET must be changed in production");
    if (env.CREATOR_PAYMENTS_PROVIDER === "stripe" && !env.STRIPE_SECRET_KEY) throw new Error("Stripe provider enabled without STRIPE_SECRET_KEY");
    if (env.CREATOR_PAYMENTS_PROVIDER === "stripe" && !env.STRIPE_WEBHOOK_SECRET) throw new Error("Stripe provider enabled without STRIPE_WEBHOOK_SECRET");
  }
  return env;
}

import { NextRequest, NextResponse } from "next/server";
import { processMockWebhook } from "@/lib/server/webhook-service";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-zerofee-signature") ?? "";
  try {
    const result = await processMockWebhook(body, signature, process.env.MOCK_WEBHOOK_SECRET ?? "mock_webhook_secret");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook failed" }, { status: 400 });
  }
}

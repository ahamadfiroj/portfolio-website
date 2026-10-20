import { NextResponse } from "next/server";
import { getPublisher } from "@/lib/redis";
import { nanoid } from "nanoid";
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const channel = (body.channel as string) || "chat:lobby";
    const text = (body.message as string) || "";
    if (!text.trim()) {
      return NextResponse.json({ ok: false, error: "empty message" }, { status: 400 });
    }
    const payload = {
      id: nanoid(),
      text,
      at: Date.now(),
    };
    await getPublisher().publish(channel, JSON.stringify(payload));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to publish message" },
      { status: 500 }
    );
  }
}
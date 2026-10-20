import { NextRequest } from "next/server";
import { subscriber } from "@/lib/redis";

export const dynamic = "force-dynamic";

// Track active subscriptions
const activeChannels = new Set<string>();

export async function GET(req: NextRequest) {
  const channel = req.nextUrl.searchParams.get("channel") || "chat:lobby";

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Create a unique message handler for this connection
      const onMessage = (ch: string, msg: string) => {
        if (ch === channel) {
          try {
            const data = `data: ${msg}\n\n`;
            controller.enqueue(encoder.encode(data));
          } catch (error) {
            console.error("Error sending message to client:", error);
          }
        }
      };

      // Subscribe to channel if not already subscribed
      if (!activeChannels.has(channel)) {
        await new Promise<void>((resolve, reject) => {
          subscriber.subscribe(channel, (err) => {
            if (err) {
              reject(err);
              return;
            }
            activeChannels.add(channel);
            resolve();
          });
        }).catch((err) => {
          controller.error(err);
          return;
        });
      }

      // Add this connection's message handler
      subscriber.on("message", onMessage);

      // Keep connection alive with ping
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(keepAlive);
        }
      }, 15000);

      // Cleanup when client disconnects
      const close = () => {
        clearInterval(keepAlive);
        // Only remove THIS connection's listener
        subscriber.off("message", onMessage);
      };

      // When client disconnects
      // @ts-ignore
      controller.signal?.addEventListener?.("abort", close);
    },
    cancel() {
      // Don't disconnect the shared subscriber
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
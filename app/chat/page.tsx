"use client";
import { useEffect, useRef, useState } from "react";
type Msg = { id: string; text: string; at: number };
export default function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const es = new EventSource("/api/stream?channel=chat:lobby");
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as Msg;
        setMsgs((m) => [...m, data]);
      } catch {}
    };
    es.onerror = () => {
      es.close();
    };
    return () => es.close();
  }, []);
  async function send() {
    const text = inputRef.current?.value || "";
    if (!text.trim()) return;
    await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "chat:lobby", message: text }),
    });
    if (inputRef.current) inputRef.current.value = "";
  }
  return (
    <main className="mx-auto max-w-md p-4 space-y-4">
      <h1 className="text-xl font-semibold">Live chat with Redis Pub Sub and NextJS</h1>
      <div className="border rounded p-3 h-72 overflow-auto bg-white text-black">
        {msgs.map((m) => (
          <div key={m.id} className="py-1">
            <span className="text-sm opacity-60">
              {new Date(m.at).toLocaleTimeString()}
            </span>{" "}
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          placeholder="Type a message"
          className="flex-1 border rounded px-3 py-2 text-black"
        />
        <button
          onClick={send}
          className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
        >
          Send
        </button>
      </div>
    </main>
  );
}
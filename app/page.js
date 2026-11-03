"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || data.error }]);
    } catch (err) {
      setMessages([...next, { role: "assistant", content: "Something went wrong." }]);
    }
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 20, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center" }}>Eon</h1>
      <div style={{ flex: 1 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0", textAlign: m.role === "user" ? "right" : "left" }}>
            <span style={{ display: "inline-block", padding: "10px 14px", borderRadius: 12, whiteSpace: "pre-wrap",
              background: m.role === "user" ? "#3b5bdb" : "#2a2a35" }}>{m.content}</span>
          </div>
        ))}
        {loading && <p style={{ opacity: 0.6 }}>Eon is thinking...</p>}
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Eon anything..."
          style={{ flex: 1, padding: 12, borderRadius: 8, border: "none", fontSize: 16 }} />
        <button style={{ padding: "12px 18px", borderRadius: 8, border: "none", background: "#3b5bdb", color: "#fff" }}>Send</button>
      </form>
    </main>
  );
}

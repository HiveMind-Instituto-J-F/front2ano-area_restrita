import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatIA = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const suggestions = [
    "O que eu posso pedir para você fazer?",
    "Qual das minhas áreas está performando com mais eficiência?",
    "Existe algum problema em potencial que eu deveria dar uma olhada?",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: "user", text: input }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Boa pergunta! Vou analisar isso 🔎" },
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "88vh", background: "#f9fafb"
    }}>
      
      <div style={{ marginBottom: "20px", fontSize: "32px" }}></div>

      <h2 style={{ fontSize: "20px", color: "#1f2937", marginBottom: "30px" }}>
        Pergunte qualquer coisa para a IA
      </h2>

      <div style={{
          flex: 1,
          width: "100%",           
          background: "#fff", 
          padding: "20px",
          overflowY: "auto"
      }}>
        {messages.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center" }}></p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: "10px", textAlign: msg.from === "user" ? "right" : "left" }}>
              <span style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "12px",
                background: msg.from === "user" ? "#f97316" : "#e5e7eb",
                color: msg.from === "user" ? "white" : "#111827",
                maxWidth: "80%"
              }}>
                {msg.text}
              </span>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setInput(s)}
            style={{
              border: "1px solid #e5e7eb",
              background: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{
        display: "flex", alignItems: "center",
        width: "100%", maxWidth: "600px",
        background: "#fff", borderRadius: "12px",
        padding: "6px 10px", border: "1px solid #e5e7eb"
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Me pergunte qualquer coisa sobre a sua indústria"
          style={{ flex: 1, border: "none", outline: "none", padding: "10px", fontSize: "14px" }}
        />
        <button onClick={handleSend} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
          <Send size={20} color="#f97316" />
        </button>
      </div>

    </div>
  );
};

export default ChatIA;

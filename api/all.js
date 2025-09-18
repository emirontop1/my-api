export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor" });
  }

  const { endpoint, ...data } = req.body;

  // === 1) NAME API ===
  if (endpoint === "name") {
    if (data.name === "Emir") {
      return res.status(200).json({ reply: "Ata" });
    }
    return res.status(200).json({ reply: `Merhaba ${data.name || "?"}` });
  }

  // === 2) CALC API ===
  if (endpoint === "calc") {
    const { a, b, operation } = data;
    if (typeof a !== "number" || typeof b !== "number") {
      return res.status(400).json({ error: "a ve b sayı olmalı" });
    }
    let result;
    switch (operation) {
      case "add": result = a + b; break;
      case "subtract": result = a - b; break;
      case "multiply": result = a * b; break;
      case "divide":
        if (b === 0) return res.status(400).json({ error: "Sıfıra bölme hatası" });
        result = a / b;
        break;
      default: return res.status(400).json({ error: "Geçersiz işlem" });
    }
    return res.status(200).json({ result });
  }

  // === 3) RANDOM PASSWORD API ===
  if (endpoint === "password") {
    const length = data.length || 8;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res.status(200).json({ password: pass });
  }

  // === 4) ROCK PAPER SCISSORS API ===
  if (endpoint === "rps") {
    const choices = ["taş", "kağıt", "makas"];
    const opponent = choices[Math.floor(Math.random() * 3)];
    const player = data.choice;
    let result;
    if (player === opponent) result = "Berabere!";
    else if (
      (player === "taş" && opponent === "makas") ||
      (player === "kağıt" && opponent === "taş") ||
      (player === "makas" && opponent === "kağıt")
    ) result = "Kazandın!";
    else result = "Kaybettin!";
    return res.status(200).json({ opponent, result });
  }

  // === DEFAULT ===
  return res.status(400).json({ error: "Geçersiz endpoint" });
}

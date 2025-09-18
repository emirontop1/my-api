export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor" });
  }

  const { a, b, operation } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({ error: "a ve b sayı olmalı" });
  }

  let result;

  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      if (b === 0) return res.status(400).json({ error: "Sıfıra bölme hatası" });
      result = a / b;
      break;
    default:
      return res.status(400).json({ error: "Geçersiz işlem" });
  }

  return res.status(200).json({ result });
}

export default function handler(req, res) {
  // CORS izinleri
  res.setHeader("Access-Control-Allow-Origin", "*"); // Her domain izinli
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Preflight request için 200 dön
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "İsim yok" });

    if (name === "Emir") {
      res.status(200).json({ reply: "Ata" });
    } else {
      res.status(200).json({ reply: `Merhaba ${name}!` });
    }
  } else {
    res.status(405).json({ error: "Sadece POST destekleniyor" });
  }
}

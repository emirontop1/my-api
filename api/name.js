export default function handler(req, res) {
  if (req.method === "POST") {
    const { name } = req.body; // Vercel default parser
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

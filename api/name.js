export default function handler(req, res) {
  if (req.method === "POST") {
    const { name } = req.body;

    if (name === "Emir") {
      return res.status(200).json({ reply: "Ata" });
    } else {
      return res.status(200).json({ reply: `Merhaba ${name}!` });
    }
  } else {
    res.status(405).json({ error: "Sadece POST destekleniyor" });
  }
}

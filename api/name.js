export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = await req.json();  // Vercel serverless functionlarda req.json() kullan
      const name = data.name;

      if (name === "Emir") {
        return res.status(200).json({ reply: "Ata" });
      } else {
        return res.status(200).json({ reply: `Merhaba ${name}!` });
      }
    } catch (err) {
      return res.status(400).json({ error: "Geçersiz JSON" });
    }
  } else {
    res.status(405).json({ error: "Sadece POST destekleniyor" });
  }
}

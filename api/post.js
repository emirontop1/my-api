import fetch from "node-fetch";

const REPO = "emirontop1/blog"; // repo adı
const FILE_PATH = "blog.json"; // kaydedilecek dosya

export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({ error: "Sadece POST destekleniyor" });

  const { content, token } = req.body;
  if(!content || !token) return res.status(400).json({ error: "content ve token gerekli" });

  const now = new Date();
  const timestamp = `${now.getDate().toString().padStart(2,'0')}.${(now.getMonth()+1).toString().padStart(2,'0')}.${now.getFullYear()}-${now.getHours().toString().padStart(2,'0')}.${now.getMinutes().toString().padStart(2,'0')}.${now.getSeconds().toString().padStart(2,'0')}`;

  try {
    // Mevcut posts.json çek
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${token}` }
    });

    let existingPosts = [];
    let sha = null;

    if(fileRes.status === 200) {
      const fileData = await fileRes.json();
      existingPosts = JSON.parse(Buffer.from(fileData.content, "base64").toString());
      sha = fileData.sha;
    }

    const newPost = { content, timestamp };
    existingPosts.unshift(newPost);

    // GitHub’a push
    await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Yeni yazı eklendi: ${timestamp}`,
        content: Buffer.from(JSON.stringify(existingPosts, null, 2)).toString("base64"),
        sha
      })
    });

    res.status(200).json({ success: true, post: newPost });
  } catch(err) {
    res.status(500).json({ error: err.toString() });
  }
}

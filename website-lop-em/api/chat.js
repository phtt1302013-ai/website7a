export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Thiếu GEMINI_API_KEY trên Vercel" });
    }

    const { message, systemPrompt } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Thiếu nội dung tin nhắn" });
    }

    const apiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nCÂU HỎI CỦA NGƯỜI DÙNG: ${message}`
              }
            ]
          }
        ]
      })
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini API error:", data);
      return res.status(geminiResponse.status).json({
        error: "Gemini API bị lỗi",
        details: data
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Dạ, Mimi chưa trả lời được lúc này rồi nè.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Lỗi server nội bộ" });
  }
}

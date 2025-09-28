// api/contact.js
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.TO_EMAIL || "andychensaputra@gmail.com";

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { name = "", email = "", message = "" } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: "Missing fields" });

    const data = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // ganti ke domain terverifikasi kalau ada
      to: [TO],
      reply_to: email,
      subject: `Portfolio Contact — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return res.status(200).json({ ok: true, id: data?.id || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send message" });
  }
};

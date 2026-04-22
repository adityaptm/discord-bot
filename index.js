require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

const app = express();
app.use(express.json());

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const PORT = process.env.PORT || 3000;

// ===== VALIDASI ENV =====
if (!TOKEN || !CHANNEL_ID) {
  console.error(
    "❌ ERROR: TOKEN atau CHANNEL_ID belum diisi di Secrets Replit!",
  );
  process.exit(1);
}

// ===== DISCORD CLIENT =====
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`✅ Bot Online sebagai: ${client.user.tag}`);
});

// ===== ROUTE: SEND UPDATE DARI WORDPRESS =====
app.post("/send", async (req, res) => {
  // Mengambil data terpisah dari payload WordPress
  const { title, message, url } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ status: "error", detail: "Data pesan kosong" });
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    // Membuat Embed agar link website (URL) bisa diklik di judul
    const embed = new EmbedBuilder()
      .setTitle(title || "Update Cavallery")
      .setDescription(message)
      .setURL(url || null) // Ini yang membuat judul biru dan bisa diklik
      .setColor(0x5865f2) // Warna Biru Discord
      .setTimestamp()
      .setFooter({ text: "Cavallery System Notification" });

    await channel.send({ embeds: [embed] });

    console.log("🚀 Notifikasi terkirim ke Discord!");
    res.json({ status: "berhasil" });
  } catch (err) {
    console.error("❌ Gagal kirim ke Discord:", err);
    res.status(500).json({ status: "error", detail: err.message });
  }
});

// Route Test untuk memastikan server jalan
app.get("/test", (req, res) => res.send("Bot Bridge is Active!"));

app.listen(PORT, () => {
  console.log(`📡 API Bridge berjalan di port ${PORT}`);
});

client.login(TOKEN);

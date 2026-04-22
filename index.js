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
  const { title, message, url } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ status: "error", detail: "Data pesan kosong" });
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    // 1. Kirim pesan teks pengumuman sesuai permintaanmu
    await channel.send("Pengumuman Penambahan Fitur Baru Website Cavallery. ");

    // 2. Kirim kotak detail (Embed) dengan link website
    const embed = new EmbedBuilder()
      .setTitle(title || "Update Baru")
      .setDescription(message)
      .setURL(url || null) // Membuat judul bisa diklik menuju URL dari form
      .setColor(0x5865f2)
      .setTimestamp()
      .setFooter({ text: "Cavallery System Notification" });

    // Tambahkan field link manual jika URL ada (agar lebih jelas)
    if (url) {
      embed.addFields({
        name: "🔗 Link Website",
        value: `[Klik di sini untuk membuka](${url})`,
      });
    }

    await channel.send({ embeds: [embed] });

    console.log("🚀 Pengumuman & Embed terkirim!");
    res.json({ status: "berhasil" });
  } catch (err) {
    console.error("❌ Gagal kirim ke Discord:", err);
    res.status(500).json({ status: "error", detail: err.message });
  }
});

app.get("/test", (req, res) => res.send("Bot Bridge is Active!"));

app.listen(PORT, () => {
  console.log(`📡 API Bridge berjalan di port ${PORT}`);
});

client.login(TOKEN);

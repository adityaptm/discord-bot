require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const PORT = process.env.PORT || 3000;

if (!TOKEN || !CHANNEL_ID) {
  console.error("❌ ERROR: TOKEN atau CHANNEL_ID belum diisi di Secrets!");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`✅ Bot Online: ${client.user.tag}`);
});

// ROUTE UTAMA
app.post("/send", async (req, res) => {
  // Pastikan mengambil 'url' dari body
  const { title, message, url } = req.body;

  if (!message) {
    return res.status(400).json({ status: "error", detail: "Pesan kosong" });
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    // 1. Kirim Pesan Teks Pengumuman (Sesuai Request)
    await channel.send("Pengumuman Penambahan Fitur Baru Website Cavallery.");

    // 2. Kirim Kotak Embed dengan Link Aktif
    const embed = new EmbedBuilder()
      .setTitle(title || "Update Baru")
      .setURL(url && url.startsWith("http") ? url : null) // VALIDASI URL
      .setDescription(message)
      .setColor(0x5865f2) // Warna Biru Discord
      .setTimestamp()
      .setFooter({ text: "Cavallery System Notification" });

    // Tambahkan field link manual agar lebih terlihat di Mobile
    if (url) {
      embed.addFields({
        name: "🔗 Website Link",
        value: `[Klik di sini untuk melihat](${url})`,
      });
    }

    await channel.send({ embeds: [embed] });

    console.log("🚀 Notifikasi Terkirim!");
    res.json({ status: "berhasil" });
  } catch (err) {
    console.error("❌ Gagal:", err);
    res.status(500).json({ status: "error", detail: err.message });
  }
});

app.listen(PORT, () => console.log(`📡 Bridge Aktif di Port ${PORT}`));
client.login(TOKEN);

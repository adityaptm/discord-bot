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

// ROUTE PENERIMA DATA
app.post("/send", async (req, res) => {
  const { title, message, url } = req.body;

  if (!message) {
    return res.status(400).json({ status: "error", detail: "Pesan kosong" });
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    // 1. Pesan Teks Pembuka (Wajib)
    await channel.send("Pengumuman Penambahan Fitur Baru Website Cavallery.");

    // 2. Kotak Embed dengan Judul yang Bisa Diklik
    const embed = new EmbedBuilder()
      .setTitle(title || "Update Baru")
      .setURL(url && url.startsWith("http") ? url : null) // Link Aktif
      .setDescription(message)
      .setColor(0x5865f2)
      .setTimestamp()
      .setFooter({ text: "Cavallery System Notification" });

    // Tambahkan field link manual agar lebih jelas di Mobile
    if (url) {
      embed.addFields({
        name: "🔗 Website Link",
        value: `[Klik di sini untuk membuka](${url})`,
      });
    }

    await channel.send({ embeds: [embed] });

    console.log("🚀 Berhasil kirim ke Discord!");
    res.json({ status: "berhasil" });
  } catch (err) {
    console.error("❌ Gagal:", err);
    res.status(500).json({ status: "error", detail: err.message });
  }
});

app.get("/test", (req, res) => res.send("Bridge Active!"));
app.listen(PORT, () => console.log(`📡 Server aktif di port ${PORT}`));
client.login(TOKEN);

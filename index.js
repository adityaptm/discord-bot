require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const PORT = process.env.PORT || 3000;

if (!TOKEN || !CHANNEL_ID) {
  console.error(
    "❌ ERROR: TOKEN atau CHANNEL_ID belum diisi di Secrets Replit!",
  );
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ===== EVENT: BOT NYALA (STARTUP) =====
client.once("ready", async () => {
  console.log(`✅ Bot Online: ${client.user.tag}`);
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    // Pesan ini langsung terkirim begitu kamu jalankan bot
    await channel.send("Pengumuman Penambahan Fitur Baru Website Cavallery. ");
    console.log("🚀 Pesan startup berhasil dikirim ke Discord.");
  } catch (err) {
    console.error("❌ Gagal mengirim pesan startup:", err);
  }
});

// ===== ROUTE: TERIMA DATA DARI WORDPRESS =====
app.post("/send", async (req, res) => {
  const { title, message, url } = req.body;

  if (!message) {
    return res.status(400).json({ status: "error", detail: "Pesan kosong" });
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setTitle(title || "Update Baru")
      .setDescription(message)
      .setURL(url || null) // Membuat judul biru & bisa diklik ke website
      .setColor(0x5865f2)
      .setTimestamp()
      .setFooter({ text: "Cavallery Website System" });

    // Tambahan field agar link terlihat jelas di HP
    if (url) {
      embed.addFields({
        name: "🔗 Link Preview",
        value: `[Klik di sini untuk melihat](${url})`,
      });
    }

    await channel.send({ embeds: [embed] });
    res.json({ status: "berhasil" });
  } catch (err) {
    console.error("❌ Error kirim Discord:", err);
    res.status(500).json({ status: "error", detail: err.message });
  }
});

app.listen(PORT, () => console.log(`📡 Server Bridge aktif di port ${PORT}`));
client.login(TOKEN);

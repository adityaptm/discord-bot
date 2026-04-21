require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== CONFIG =====
const TOKEN = process.env.TOKEN; //
const CHANNEL_ID = process.env.CHANNEL_ID;
const PORT = process.env.PORT || 9999;

// ===== CEK ENV =====
if (!TOKEN || !CHANNEL_ID) {
  console.error("TOKEN atau CHANNEL_ID belum diisi di .env");
  process.exit(1);
}

// ===== DISCORD CLIENT =====
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ===== BOT READY =====
client.once("ready", async () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);
  console.log("Channel ketemu:", channel.name);

  await channel.send("Bot Passion Erine Sudah Aktif. ");
});

// ===== TEST ROUTE =====
app.get("/test", async (req, res) => {
  const channel = await client.channels.fetch(CHANNEL_ID);
  await channel.send("TEST DARI SERVER");

  res.send("OK BERHASIL");
});

// ===== SEND MESSAGE =====
app.post("/send", async (req, res) => {
  const message = req.body?.message;

  if (!message) {
    return res.json({ status: "error", detail: "message kosong" });
  }

  const channel = await client.channels.fetch(CHANNEL_ID);

  await channel.send({
    embeds: [
      {
        title: "Notifikasi",
        description: message,
        color: 5814783,
      },
    ],
  });

  res.json({ status: "berhasil" });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`API jalan di http://127.0.0.1:${PORT}`);
});

// ===== LOGIN BOT =====
client.login(TOKEN);

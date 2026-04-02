export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { barber, service, date, time } = req.body;

  // Use process.env for Node.js serverless functions (Vercel backend)
  const botToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.VITE_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId || botToken === 'your_bot_token_here') {
    return res.status(500).json({ error: 'Telegram credentials missing or invalid' });
  }

  const message = `🔔 *New Booking:*\n\n*Barber:* ${barber}\n*Service:* ${service}\n*Date:* ${date}\n*Time:* ${time}`;

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const result = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error("Telegram API Error:", result);
      return res.status(500).json({ error: 'Failed to send Telegram message' });
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error("Serverless Telegram function error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

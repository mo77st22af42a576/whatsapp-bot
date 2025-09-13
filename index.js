const venom = require('venom-bot');
const axios = require('axios');

const AI_URL = "https://api.gpt4free.online/v1/chat/completions";

venom
  .create({
    session: 'my-bot',   // حفظ الجلسة لتجنب مسح QR Code كل مرة
    headless: true,       // بدون واجهة متصفح
    multidevice: false    // يمكن تغييره حسب الحاجة
  })
  .then((client) => start(client))
  .catch((err) => console.log("❌ خطأ في إنشاء البوت:", err));

function start(client) {
  console.log("✅ البوت جاهز ويستقبل الرسائل");

  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      try {
        const response = await axios.post(AI_URL, {
          model: "gpt-4",
          messages: [{ role: "user", content: message.body }]
        });

        const reply = response.data.choices[0].message.content;
        await client.sendText(message.from, reply);
        console.log("⚡ تم الرد:", reply);

      } catch (error) {
        console.error("⚠️ خطأ AI:", error.message);
        await client.sendText(message.from, "حصل خطأ، حاول مرة أخرى 🙏");
      }
    }
  });
}

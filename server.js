require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false
}));

const clean = (value, max) => String(value || "").trim().slice(0, max);

app.post("/api/requests", async (req, res) => {
  const name = clean(req.body.name, 80);
  const mobile = clean(req.body.mobile, 15).replace(/[^\d+]/g, "");
  const service = clean(req.body.service, 100);
  const details = clean(req.body.details, 1000);
  const consent = req.body.consent === true;

  if (!name || !/^\+?\d{10,15}$/.test(mobile) || !service || !consent) {
    return res.status(400).json({ ok: false, message: "कृपया सही जानकारी भरें और सहमति दें।" });
  }

  const { META_GRAPH_VERSION, META_PHONE_NUMBER_ID, META_ACCESS_TOKEN,
          META_TEMPLATE_NAME, META_TEMPLATE_LANGUAGE, WHATSAPP_ADMIN_NUMBER } = process.env;

  if (!META_GRAPH_VERSION || META_GRAPH_VERSION.includes("XX") ||
      !META_PHONE_NUMBER_ID || !META_ACCESS_TOKEN ||
      !META_TEMPLATE_NAME || !WHATSAPP_ADMIN_NUMBER) {
    return res.status(503).json({
      ok: false,
      message: "वेबसाइट फॉर्म तैयार है, लेकिन WhatsApp API सेटअप पूरा होना बाकी है।"
    });
  }

  const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: WHATSAPP_ADMIN_NUMBER,
    type: "template",
    template: {
      name: META_TEMPLATE_NAME,
      language: { code: META_TEMPLATE_LANGUAGE || "hi" },
      components: [{
        type: "body",
        parameters: [
          { type: "text", text: name },
          { type: "text", text: mobile },
          { type: "text", text: service },
          { type: "text", text: details || "कोई अतिरिक्त जानकारी नहीं" }
        ]
      }]
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${META_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return res.status(502).json({
        ok: false,
        message: "WhatsApp संदेश नहीं भेजा जा सका। API सेटिंग जाँचें।"
      });
    }
    return res.json({ ok: true, message: "आपकी जानकारी Gupta Communication को भेज दी गई है।" });
  } catch (error) {
    console.error("Notification error:", error.message);
    return res.status(500).json({ ok: false, message: "अभी संदेश भेजने में समस्या है।" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Gupta Communication website running on port ${port}`));
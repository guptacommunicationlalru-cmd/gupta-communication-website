GUPTA COMMUNICATION LALRU - WEBSITE STARTER

इस ZIP में वेबसाइट का फ्रंटएंड और WhatsApp Cloud API के लिए सुरक्षित सर्वर कोड है।
अभी WhatsApp API कनेक्ट नहीं है; Meta सेटअप और approved message template के बाद ही
ग्राहक की रिक्वेस्ट आपके 9023111353 नंबर पर अपने-आप WhatsApp होगी।

1) Meta WhatsApp Business Platform में business portfolio, WhatsApp Business Account,
   app और API-सक्षम sender phone number सेट करें:
   https://whatsappbusiness.com/developers/developer-hub/

2) API sender number और admin notification number अलग हो सकते हैं।
   Admin destination इस प्रोजेक्ट में 919023111353 सेट है।
   इसे उसी नंबर के रूप में रखें जिस पर आप WhatsApp संदेश पाना चाहते हैं।

3) Meta में new_customer_request नाम का Hindi message template बनाएँ और approval लें।
   Template body में ये चार placeholders इसी क्रम में रखें:
   ग्राहक: {{1}}
   मोबाइल: {{2}}
   सेवा: {{3}}
   जानकारी: {{4}}

4) इस folder की कॉपी करके .env.example का नाम .env करें।
   Meta dashboard से Graph API version, Phone Number ID और access token भरें।
   Token को कभी वेबसाइट के HTML, WhatsApp chat या सार्वजनिक जगह पर न डालें।

5) Node.js 18+ इंस्टॉल करके इस folder में चलाएँ:
   npm install
   npm start

6) वेबसाइट को public HTTPS hosting पर deploy करें। केवल server environment variables में
   Meta token रखें। Live करने से पहले test message, consent, privacy notice और spam controls
   जाँचें।

महत्वपूर्ण:
- 9023111353 यहाँ notification पाने वाला नंबर है, API से message بھیجنے वाला sender
  number नहीं। Sender number Meta Cloud API में अलग से configure/verify करना होगा।
- Meta की messaging policy के अनुसार business-initiated notifications के लिए approved
  template और ग्राहक की उचित opt-in/consent आवश्यक हो सकती है।
- यह starter project है, live hosted website नहीं। Hosting/domain और Meta approval अभी बाकी हैं।
- ग्राहकों से Aadhaar, OTP, बैंक पासवर्ड या अन्य संवेदनशील जानकारी इस सामान्य फॉर्म में न लें।

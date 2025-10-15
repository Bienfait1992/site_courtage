// services/whatsapp.js
const twilio = require('twilio');

// Renseigne tes identifiants Twilio dans les variables d'environnement
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

const client = twilio(accountSid, authToken);

/**
 * Envoie un message WhatsApp
 * @param {string} to - Numéro du destinataire au format international, ex: +243812345678
 * @param {string} message - Texte du message
 */
async function sendWhatsAppNotification(to, message) {
  if (!to || !message) {
    throw new Error('Numéro et message requis pour WhatsApp');
  }

  try {
    const response = await client.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${to}`,
      body: message,
    });

    console.log('WhatsApp envoyé:', response.sid);
    return response;
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error);
    throw error;
  }
}

module.exports = sendWhatsAppNotification;

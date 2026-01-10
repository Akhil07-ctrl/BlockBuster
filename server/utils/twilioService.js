const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const formatBookingMessage = (bookingDetails, userName) => {
    const { entityId, venueId, date, showTime, quantity, totalAmount } = bookingDetails;
    const entityName = entityId ? (entityId.title || entityId.name || 'Event') : 'Booking';
    const venueName = venueId ? venueId.name : 'Venue';
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    let message = `🎬 *Booking Confirmed!* 🎬\n\n`;
    message += `Hi *${userName}*,\n`;
    message += `Your booking for *${entityName}* at *${venueName}* is confirmed! ✅\n\n`;
    message += `📅 Date: ${formattedDate}\n`;
    if (showTime) message += `🕒 Time: ${showTime}\n`;
    message += `🎟️ Quantity: ${quantity}\n`;
    message += `💰 Amount: ₹${totalAmount}\n`;
    message += `🆔 Booking ID: ${bookingDetails._id}\n\n`;
    message += `See you there! 🍿`;

    return message;
};

const sendWhatsAppConfirmation = async (userPhone, bookingDetails, userName) => {
    // Ensure phone number starts with country code if not present, but safer to assume Clerk provides it.
    // Twilio whatsapp requires format: whatsapp:+1234567890

    // Clerk usually stores phone numbers in E.164 format (+1234567890)

    try {
        const message = formatBookingMessage(bookingDetails, userName);
        const envNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';
        const from = envNumber.startsWith('whatsapp:') ? envNumber : `whatsapp:${envNumber}`;
        const to = `whatsapp:${userPhone}`;

        console.log(`Sending WhatsApp format to ${to} from ${from}`);

        const response = await client.messages.create({
            body: message,
            from: from,
            to: to
        });

        console.log(`WhatsApp sent successfully: ${response.sid}`);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
};

module.exports = { sendWhatsAppConfirmation };

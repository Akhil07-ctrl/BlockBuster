const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends a booking confirmation email
 * @param {Object} booking - The booking object
 * @param {Object} entity - The movie/event/etc details
 * @param {Object} venue - The venue details
 */
const sendBookingConfirmation = async (booking, entity, venue) => {
    console.log(`Attempting to send email to ${booking.email} for ${booking.entityType}...`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not found in environment variables. Skipping email sending.');
        return;
    }

    const entityName = entity.title || entity.name;
    const bookingDate = booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A';
    
    const mailOptions = {
        from: `"BlockBuster" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: `Booking Confirmed: ${entityName} - BlockBuster`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #6366f1; text-align: center;">Booking Confirmed!</h2>
                <p>Hi there,</p>
                <p>Your booking for <strong>${entityName}</strong> has been successfully confirmed. Here are your details:</p>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Booking ID:</strong> #${booking._id.toString().slice(-6).toUpperCase()}</p>
                    <p><strong>Type:</strong> ${booking.entityType}</p>
                    <p><strong>Date:</strong> ${bookingDate}</p>
                    ${booking.showTime ? `<p><strong>Show Time:</strong> ${booking.showTime}</p>` : ''}
                    ${venue ? `<p><strong>Venue:</strong> ${venue.name}</p>` : ''}
                    ${booking.seats && booking.seats.length > 0 ? `<p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>` : ''}
                    <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
                    <p><strong>Status:</strong> ${booking.status.toUpperCase()}</p>
                </div>
                
                <p>Thank you for choosing BlockBuster!</p>
                <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
                    This is an automated email. Please do not reply.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${booking.email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {
    sendBookingConfirmation
};

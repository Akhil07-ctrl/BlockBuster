const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
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
 * @param {String} userName - The name of the user
 */
const sendBookingConfirmation = async (booking, entity, venue, userName) => {
    console.log('--- EMAIL DEBUG ---');
    console.log(`To: ${booking.email}`);
    console.log(`From (User): ${process.env.EMAIL_USER}`);
    console.log(`Entity: ${entity.title || entity.name}`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('EMAIL_USER or EMAIL_PASS not found. Skipping.');
        return;
    }

    console.log(`Attempting to send email to ${booking.email} for ${booking.entityType}...`);

    const entityName = entity.title || entity.name;
    const entityImage = entity.poster || entity.image;
    const bookingDate = booking.date ? new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';
    const appUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        
                        <!-- Header with Poster/Banner -->
                        <tr>
                            <td style="background-color: #111827; position: relative;">
                                ${entityImage ? `
                                    <img src="${entityImage}" alt="${entityName}" style="width: 100%; height: 250px; object-fit: cover; opacity: 0.8; display: block;">
                                ` : `
                                    <div style="height: 100px; width: 100%; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);"></div>
                                `}
                                <div style="padding: 24px; text-align: center; margin-top: -60px; position: relative; z-index: 10;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); line-height: 1.2; font-weight: 800;">
                                        ${entityName}
                                    </h1>
                                </div>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 32px 24px;">
                                <div style="text-align: center; margin-bottom: 24px;">
                                    <h2 style="margin: 0 0 8px; color: #4f46e5; font-size: 22px; font-weight: 700;">Booking Confirmed!</h2>
                                    <p style="margin: 0; color: #6b7280; font-size: 16px;">Hi ${userName || 'Movie Buff'}, your tickets are ready.</p>
                                </div>

                                <!-- Ticket Card -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                                    <!-- Top Section -->
                                    <tr>
                                        <td style="padding: 20px; border-bottom: 2px dashed #d1d5db;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="50%" style="padding-bottom: 16px;">
                                                        <div style="color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Date</div>
                                                        <div style="color: #111827; font-size: 15px; font-weight: 700; margin-top: 4px;">${bookingDate}</div>
                                                    </td>
                                                    <td width="50%" style="text-align: right; padding-bottom: 16px;">
                                                        <div style="color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Time</div>
                                                        <div style="color: #111827; font-size: 15px; font-weight: 700; margin-top: 4px;">${booking.showTime || 'All Day'}</div>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            ${venue ? `
                                            <div style="margin-top: 4px;">
                                                <div style="color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Venue</div>
                                                <div style="color: #111827; font-size: 15px; font-weight: 700; margin-top: 4px;">${venue.name}</div>
                                                <div style="color: #6b7280; font-size: 13px; margin-top: 2px;">${venue.address || ''}</div>
                                            </div>
                                            ` : ''}
                                        </td>
                                    </tr>

                                    <!-- Bottom Section -->
                                    <tr>
                                        <td style="padding: 20px; background-color: #f3f4f6;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td>
                                                        <div style="color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Booking ID</div>
                                                        <div style="color: #4f46e5; font-family: monospace; font-size: 16px; font-weight: 700; margin-top: 4px; letter-spacing: 1px;">
                                                            #${booking._id.toString().slice(-6).toUpperCase()}
                                                        </div>
                                                    </td>
                                                    ${booking.seats && booking.seats.length > 0 ? `
                                                    <td style="text-align: right;">
                                                        <div style="color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Seats</div>
                                                        <div style="color: #111827; font-size: 15px; font-weight: 700; margin-top: 4px;">${booking.seats.join(', ')}</div>
                                                    </td>
                                                    ` : ''}
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    ${booking.totalAmount ? `
                                    <tr>
                                        <td style="padding: 10px 20px; text-align: right; border-top: 1px solid #e5e7eb; background: #fff;">
                                            <span style="font-size: 12px; color: #6b7280;">Total Paid: </span>
                                            <span style="font-weight: 700; color: #10b981; font-size: 16px;">₹${booking.totalAmount}</span>
                                        </td>
                                    </tr>
                                    ` : ''}
                                </table>

                                <!-- CTA Button -->
                                <div style="text-align: center; margin-top: 32px;">
                                    <a href="${appUrl}/profile" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                                        View My Bookings
                                    </a>
                                </div>

                                <!-- Thank You -->
                                <div style="text-align: center; margin-top: 24px;">
                                    <p style="margin: 0; color: #111827; font-size: 15px; font-weight: 600;">Thank you for choosing BlockBuster!</p>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                                    Need help? <a href="mailto:support@blockbuster.com" style="color: #4f46e5; text-decoration: none; font-weight: 600;">support@blockbuster.com</a>
                                </p>
                                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-style: italic;">
                                    This is an automated email. Please do not reply.
                                </p>
                                <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                                    &copy; ${new Date().getFullYear()} BlockBuster Inc. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"BlockBuster" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: `Booking Confirmed: ${entityName} - BlockBuster`,
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent successfully via Nodemailer. Message ID: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending email via Nodemailer:', error);
    }
};

module.exports = {
    sendBookingConfirmation
};

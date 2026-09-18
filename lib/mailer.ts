import nodemailer from "nodemailer";

type BookingEmailData = {
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: number;
  foodOrder?: Array<{ name: string; qty: number; price: number }>;
  specialRequest?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendBookingEmail(booking: BookingEmailData) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const restaurantEmail = process.env.RESTAURANT_EMAIL || "ascreater401@gmail.com";

  if (!user || !pass) {
    console.warn("Gmail SMTP is not configured. Booking was saved, but no email was sent.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });

  const food = booking.foodOrder?.length
    ? booking.foodOrder
        .map(
          (i) =>
            `<li>${escapeHtml(i.name)} × ${i.qty} — ₹${i.price * i.qty}</li>`
        )
        .join("")
    : "<li>No food pre-order</li>";

  const specialRequest = booking.specialRequest
    ? `<h2>Special request</h2><p>${escapeHtml(booking.specialRequest)}</p>`
    : "";

  // Email sent to the restaurant.
  await transporter.sendMail({
    from: `"Narula's Restaurant" <${user}>`,
    to: restaurantEmail,
    replyTo: booking.customerEmail,
    subject: `New Table Booking — ${booking.bookingCode} — Table ${booking.tableNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#171717">
        <h1 style="margin-bottom:4px">New booking at Narula's Restaurant</h1>
        <p style="color:#666">Booking ID: <b>${escapeHtml(booking.bookingCode)}</b></p>
        <hr/>
        <h2>Reservation</h2>
        <p><b>Date:</b> ${escapeHtml(booking.date)}<br/>
        <b>Time:</b> ${escapeHtml(booking.time)}<br/>
        <b>Guests:</b> ${booking.guests}<br/>
        <b>Table:</b> ${booking.tableNumber}</p>
        <h2>Customer</h2>
        <p><b>Name:</b> ${escapeHtml(booking.customerName)}<br/>
        <b>Email:</b> ${escapeHtml(booking.customerEmail)}<br/>
        <b>Phone:</b> ${escapeHtml(booking.customerPhone)}</p>
        <h2>Pre-ordered food</h2>
        <ul>${food}</ul>
        ${specialRequest}
      </div>
    `
  });

  // Confirmation email sent to the guest who made the reservation.
  await transporter.sendMail({
    from: `"Narula's Restaurant" <${user}>`,
    to: booking.customerEmail,
    replyTo: restaurantEmail,
    subject: `Reservation Confirmed — ${booking.bookingCode} — Narula's Restaurant`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#171717;background:#faf9f7;padding:28px">
        <div style="background:#171717;color:#fff;padding:24px;border-radius:14px 14px 0 0">
          <div style="font-size:12px;letter-spacing:2px;color:#f97316">NARULA'S RESTAURANT</div>
          <h1 style="margin:10px 0 4px;font-size:28px">Your reservation is confirmed</h1>
          <p style="margin:0;color:#ddd">We look forward to welcoming you, ${escapeHtml(booking.customerName)}.</p>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:0;border-radius:0 0 14px 14px">
          <p style="font-size:15px;color:#555">Your booking code is <strong style="color:#171717">${escapeHtml(booking.bookingCode)}</strong></p>
          <h2>Reservation details</h2>
          <p>
            <b>Date:</b> ${escapeHtml(booking.date)}<br/>
            <b>Time:</b> ${escapeHtml(booking.time)}<br/>
            <b>Guests:</b> ${booking.guests}<br/>
            <b>Table:</b> ${booking.tableNumber}
          </p>
          <h2>Pre-ordered food</h2>
          <ul>${food}</ul>
          ${specialRequest}
          <div style="margin-top:24px;padding:16px;background:#fff4eb;border-radius:10px">
            <strong>Important:</strong> Please keep this email or your booking code handy when you arrive.
          </div>
          <p style="margin-top:24px;color:#666;font-size:13px">For changes or questions, reply to this email or contact Narula's Restaurant.</p>
        </div>
      </div>
    `
  });
}

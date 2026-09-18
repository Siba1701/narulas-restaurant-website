import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { sendBookingEmail } from "../../../lib/mailer";

const tables = [
  ...Array.from({ length: 5 }, (_, i) => ({ number: i + 1, capacity: 2 })),
  ...Array.from({ length: 10 }, (_, i) => ({ number: i + 6, capacity: 5 }))
];

function validTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return Number.isInteger(h) && Number.isInteger(m) &&
    h >= 11 && h <= 23 && [0, 30].includes(m);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    if (!date || !time || !validTime(time)) return NextResponse.json({ booked: [] });

    const bookings = await prisma.booking.findMany({
      where: { date, time },
      select: { tableNumber: true }
    });
    return NextResponse.json({ booked: bookings.map(b => b.tableNumber) });
  } catch (error) {
    console.error("Availability check failed:", error);
    return NextResponse.json(
      { booked: [], error: "Could not load table availability." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, date, time, guests, tableNumber, foodOrder, specialRequest } = body;

    if (!customerName || !customerEmail || !customerPhone || !date || !time || !guests || !tableNumber) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    if (!validTime(time)) return NextResponse.json({ error: "Bookings are available from 11:00 AM to 11:00 PM in 30-minute slots." }, { status: 400 });

    const table = tables.find(t => t.number === Number(tableNumber));
    if (!table) return NextResponse.json({ error: "Invalid table." }, { status: 400 });
    if (Number(guests) > table.capacity) {
      return NextResponse.json({ error: `Table ${table.number} seats up to ${table.capacity} guests.` }, { status: 400 });
    }

    const existing = await prisma.booking.findUnique({
      where: {
        date_time_tableNumber: {
          date,
          time,
          tableNumber: Number(tableNumber)
        }
      }
    });
    if (existing) return NextResponse.json({ error: "That table is already booked for this time. Please choose another table." }, { status: 409 });

    const bookingCode = `NR-${Date.now().toString(36).toUpperCase()}`;

    let booking;
    try {
      booking = await prisma.booking.create({
      data: {
        bookingCode,
        customerName,
        customerEmail,
        customerPhone,
        date,
        time,
        guests: Number(guests),
        tableNumber: Number(tableNumber),
        tableCapacity: table.capacity,
        foodOrder: foodOrder ?? [],
        specialRequest: specialRequest || null
      }
      });
    } catch (error: any) {
      // The database unique constraint is the final protection when two devices
      // submit the same table at nearly the same moment.
      if (error?.code === "P2002") {
        return NextResponse.json(
          { error: "That table was just booked by another guest. Please choose another table." },
          { status: 409 }
        );
      }
      throw error;
    }

    let emailSent = false;
    try {
      await sendBookingEmail({
        bookingCode,
        customerName,
        customerEmail,
        customerPhone,
        date,
        time,
        guests: Number(guests),
        tableNumber: Number(tableNumber),
        foodOrder: foodOrder ?? [],
        specialRequest
      });
      emailSent = true;
    } catch (e) {
      console.error("Booking email failed:", e);
    }

    return NextResponse.json({ success: true, bookingCode, emailSent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to complete booking." }, { status: 500 });
  }
}
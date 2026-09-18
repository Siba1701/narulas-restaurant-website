# Narula's Restaurant

A minimal, modern restaurant website with:
- Responsive homepage and food gallery
- Real table booking from 11:00 AM to 11:00 PM in 30-minute slots
- 15 numbered tables: Tables 1–5 seat 2; Tables 6–15 seat 4–5
- Live booked/available table states for each date + time
- Table selection on a visual dining-room map
- Food pre-order attached to the reservation
- Prisma persistence
- Gmail notification to `ascreater401@gmail.com`

## Run locally

```bash
pnpm install
copy .env.example .env
pnpm prisma generate
pnpm db:push
pnpm dev
```

Open http://localhost:3000

## Gmail notifications

1. Turn on 2-Step Verification for the Gmail account used to send mail.
2. Create a Gmail App Password.
3. Put the 16-character app password into `GMAIL_APP_PASSWORD` in `.env`.
4. Keep `GMAIL_USER` and `RESTAURANT_EMAIL` as `ascreater401@gmail.com`.

Do not put the Gmail password directly in source code.

## Production deployment (Netlify)

This deployment-ready version uses PostgreSQL because Netlify serverless functions should not use a local SQLite file as the shared production database.

1. Create a hosted PostgreSQL database (for example, Neon).
2. Copy its connection string into `DATABASE_URL`.
3. Locally, run `npm install`, then `npx prisma generate`, then `npx prisma db push` to create the Booking table in that hosted database.
4. In Netlify, add these environment variables: `DATABASE_URL`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `RESTAURANT_EMAIL`.
5. Deploy with the included `netlify.toml`; Netlify will run `npm run build`.

The API imports use relative paths so the Netlify/Turbopack build does not depend on a missing `@/` path alias.


## Testing from another phone/laptop on the same Wi-Fi

A localhost URL belongs to the computer running Next.js. To let another device use the same local booking backend, start Next.js so it listens on the LAN:

```powershell
pnpm.cmd dev --hostname 0.0.0.0
```

On the PC, find its IPv4 address with:

```powershell
ipconfig
```

Then another device on the same Wi-Fi can open:

```text
http://YOUR-PC-IP:3000
```

Example:

```text
http://192.168.1.2:3000
```

If Windows Firewall asks whether Node.js may communicate on the network, allow it on your Private network.

Important: if every device runs its own separate `localhost:3000`, each device has its own local database and bookings will NOT be shared. For a real restaurant website, deploy one backend/database and have every device connect to that same server.

## Gmail

Bookings are stored even if email delivery fails. To receive notifications, configure the `.env` Gmail App Password:

```env
GMAIL_USER="ascreater401@gmail.com"
GMAIL_APP_PASSWORD="YOUR_16_CHARACTER_APP_PASSWORD"
RESTAURANT_EMAIL="ascreater401@gmail.com"
```

After changing `.env`, restart the Next.js server.

## Netlify build fix

The project includes `@types/nodemailer` in devDependencies and a fallback declaration file for Nodemailer so TypeScript can complete the Netlify production build.

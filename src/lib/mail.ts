import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export async function sendContactEmails(payload: ContactPayload) {
  const key = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "Rabiega Development <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!key || !adminEmail) {
    console.warn(
      "[mail] Brak RESEND_API_KEY lub ADMIN_EMAIL — pomijam wysyłkę e-mail.",
    );
    return;
  }

  const resend = new Resend(key);
  const phoneLine = payload.phone
    ? `<p><strong>Telefon:</strong> ${escapeHtml(payload.phone)}</p>`
    : "";

  await resend.emails.send({
    from,
    to: adminEmail,
    replyTo: payload.email,
    subject: `Nowe zapytanie: ${payload.name}`,
    html: `
      <h2>Nowe zapytanie ze strony</h2>
      <p><strong>Imię / nazwa:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(payload.email)}</p>
      ${phoneLine}
      <p><strong>Wiadomość:</strong></p>
      <pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(payload.message)}</pre>
    `,
  });

  await resend.emails.send({
    from,
    to: payload.email,
    subject: "Dziękujemy za kontakt — Rabiega Development",
    html: `
      <p>Cześć ${escapeHtml(payload.name)},</p>
      <p>Dziękujemy za wiadomość. Odezwę się tak szybko, jak to możliwe.</p>
      <p>Pozdrawiam,<br/>Rabiega Development</p>
    `,
  });
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

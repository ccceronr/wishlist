import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT ?? 587),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  origin: string
) {
  const resetUrl = `${origin}/reset-password?token=${token}`;

  if (!process.env.EMAIL_USER) {
    // En desarrollo sin SMTP configurado, mostrar link en consola
    console.log(`\n[DEV] Enlace para restablecer contraseña de ${to}:\n${resetUrl}\n`);
    return;
  }

  await transporter.sendMail({
    from: `"Wishlist" <${process.env.EMAIL_FROM ?? process.env.EMAIL_USER}>`,
    to,
    subject: "Restablecer contraseña — Wishlist",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Restablecer contraseña</h2>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta Wishlist.</p>
        <p>Haz click en el botón de abajo. El enlace expira en <strong>1 hora</strong>.</p>
        <a href="${resetUrl}"
          style="display:inline-block;margin:16px 0;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Restablecer contraseña
        </a>
        <p style="color:#888;font-size:13px">Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  });
}

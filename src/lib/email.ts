import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

  try {
    await transporter.sendMail({
      from: `"Panda Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Восстановление пароля в Panda Store',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Восстановление пароля</h1>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Здравствуйте!<br><br>
            Вы запросили восстановление пароля в Panda Store. 
            Для сброса пароля нажмите на кнопку ниже:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${resetLink}" 
              style="
                background-color: #000;
                color: #fff;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 4px;
                display: inline-block;
                font-size: 16px;
              "
            >
              Сбросить пароль
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.<br>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
            <p>Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
            <p>© ${new Date().getFullYear()} Panda Store. Все права защищены.</p>
          </div>
        </div>
      `
    });

    return true;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }
}
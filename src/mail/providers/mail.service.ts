import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../users/providers/user.entity';
import * as sendGridMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  /**
   * service sends all email notification/actions
   * @param _mailerService
   */
  constructor(private readonly _mailerService: MailerService) {
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  //todo: welcome.ejs needs to be designed(inline css)
  public async sendUserWelcome(user: User, otp: string, url?: string) {
    await this._mailerService.sendMail({
      to: user.email,
      from: `Onboarding Team <no-reply@admin.com>`,
      subject: 'Welcome to ChoreTrolly',
      template: './welcome',
      context: {
        name: user.firstName,
        email: user.email,
        otp: otp,
        loginUrl: url,
      },
    });
  }

  /**
   * Other email notification call action should be here
   */
  public async sendUserWelcome2(
    user: User,
    url?: string,
    subject?: string,
    html?: string,
  ) {
    const htmlTemplate =
      html ||
      `<!DOCTYPE html>
          <html>
            <head>
                <title>Email Notification</title>
            </head>
            <body>
                <div class="container" style="background:#fff; padding:24px;border-radius:8px; max-width:500px; margin:40px auto; font-family:Arial,sans-serif;">
                    <h2>Welcome to ChoreTrolley!</h2>
                    <p>Dear ${user.firstName},</p>
                    <p>Thank you for signing up with us. Your email address is ${user.email}.</p>
                    <p>Activate your account <a href="${url}">here</a></p>
                    <p>Best Regards, ChoreTrolley Team</p>
                </div>
                <div class="footer" style="text-align:center; margin-top:20px; font-size:12px; color:#aaa;">
                    <p>&copy; ${new Date().getFullYear()} ChoreTrolley. All rights reserved.</p>
            
                </div>
            </body>
          </html>`;
    await sendGridMail.send({
      to: user.email,
      from: {
        email: process.env.SENDGRID_FROM,
        name: process.env.MAIL_FROM_NAME,
      },
      subject: subject || 'Welcome to ChoreTrolly',
      html: htmlTemplate,
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../users/providers/user.entity';
import * as sendGridMail from '@sendgrid/mail';
import { Booking } from "../../services/entities/Booking";

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
                    <h2>Welcome to ChoreTrolly!</h2>
                    <p>Dear ${user.firstName},</p>
                    <p>Thank you for signing up with us. Your email address is ${user.email}.</p>
                    <p>Activate your account <a href="${url}">here</a></p>
                    <p>Best Regards, ChoreTrolly Team</p>
                </div>
                <div class="footer" style="text-align:center; margin-top:20px; font-size:12px; color:#aaa;">
                    <p>&copy; ${new Date().getFullYear()} ChoreTrolley. All rights reserved.</p>
            
                </div>
            </body>
          </html>`;

    const configureMsg = {
      to: user.email,
      from: {
        email: process.env.SENDGRID_FROM,
        name: process.env.MAIL_FROM_NAME,
      },
      subject: subject || 'Welcome to ChoreTrolly',
      html: htmlTemplate,
    };

    try {
      await sendGridMail.send(configureMsg);
      this.logger.log(`Email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed Sendgrid Email Notification: ${error.message}`);
    }
  }


  /**
   * Booking notification on pending
   * @param user
   * @param booking
   * @param subject
   * @param html
   */
  public async sendBookingNotification(
          user: User,
          booking: Booking,
          status: string,
          subject?: string,
          html?: string,
  ) {
    const htmlTemplate =
            html ||
            `<!DOCTYPE html>
          <html>
            <head>
                <title>Choretrolly Booking Notification</title>
            </head>
            <body>
                <div class="container" style="background:#fff; padding:24px;border-radius:8px; max-width:500px; margin:40px auto; font-family:Arial,sans-serif;">
                    <h2>Choretrolly Booking Notification!</h2>
                    <p>Dear ${user.firstName.toUpperCase()},</p>
                    <p>Thank you for booking <b>${booking.service.title}</b>.</p>
                    <p>Kindly note that the status of your request is ${status}</p>
                    <p>Once accepted by the provider, you will be notified</p>
                    <p>Best Regards, ChoreTrolly Team</p>
                </div>
                <div class="footer" style="text-align:center; margin-top:20px; font-size:12px; color:#aaa;">
                    <p>&copy; ${new Date().getFullYear()} ChoreTrolly. All rights reserved.</p>
            
                </div>
            </body>
          </html>`;

    const configureMsg = {
      to: user.email,
      from: {
        email: process.env.SENDGRID_FROM,
        name: process.env.MAIL_FROM_NAME,
      },
      subject: subject || 'Welcome to ChoreTrolly',
      html: htmlTemplate,
    };

    try {
      await sendGridMail.send(configureMsg);
      this.logger.log(`Email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed Sendgrid Email Notification: ${error.message}`);
    }
  }

  public async sendItemNotification(
          user: User,
          title: string,
          subject?: string,
          html?: string,
  ) {
    const htmlTemplate =
            html ||
            `<!DOCTYPE html>
          <html>
            <head>
                <title>${subject}</title>
            </head>
            <body>
                <div class="container" style="background:#fff; padding:24px;border-radius:8px; max-width:500px; margin:40px auto; font-family:Arial,sans-serif;">
                    <h2>${subject}</h2>
                    <p>Dear ${user.firstName.toUpperCase()},</p>
                    <p>Thank you for buying <b>${title}</b>.</p>
                    <p>Kindly note that the status of your request is processed</p>
                    <p>Please wait for the admin to approve your order. You can track your order status on the dashboard.</p>
                    <p>Thank you for choosing ChoreTrolly.</p>
                </div>
                <div class="footer" style="text-align:center; margin-top:20px; font-size:12px; color:#aaa;">
                    <p>&copy; ${new Date().getFullYear()} ChoreTrolly. All rights reserved.</p>
            
                </div>
            </body>
          </html>`;

    const configureMsg = {
      to: user.email,
      from: {
        email: process.env.SENDGRID_FROM,
        name: process.env.MAIL_FROM_NAME,
      },
      subject: subject || 'Welcome to ChoreTrolly',
      html: htmlTemplate,
    };

    try {
      await sendGridMail.send(configureMsg);
      this.logger.log(`Email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed Sendgrid Email Notification: ${error.message}`);
    }
  }
}

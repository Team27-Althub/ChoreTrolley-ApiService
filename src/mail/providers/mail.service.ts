import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../users/providers/user.entity';

@Injectable()
export class MailService {
  /**
   * service sends all email notification/actions
   * @param _mailerService
   */
  constructor(private readonly _mailerService: MailerService) {}

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
}

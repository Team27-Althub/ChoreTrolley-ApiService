import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../users/providers/user.entity';

@Injectable()
export class MailService {
  /**
   * service sends all email notification/actions
   * @param mailerService
   */
  constructor(private readonly mailerService: MailerService) {}

  //todo: welcome.ejs needs to be designed(inline css)
  public async sendUserWelcome(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: `Onboarding Team <no-reply@admin.com>`,
      subject: 'Welcome to ChoreTrolly',
      template: './welcome',
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'hptt://localhost:3000',
      },
    });
  }

  /**
   * Other email notification call action should be here
   */
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaystackService {
  constructor(private readonly http: HttpService) {}

  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  private get headers() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async initPayment(email: string, amount: number, callbackUrl: string) {
    try {
      const response$ = this.http.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100,
          callback_url: callbackUrl,
        },
        { headers: this.headers },
      );

      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response$ = this.http.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.headers },
      );

      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data, HttpStatus.BAD_REQUEST);
    }
  }
}

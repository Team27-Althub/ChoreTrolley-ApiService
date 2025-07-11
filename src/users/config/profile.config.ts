import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

/**
 * use for users module specific api calls
 */
export default registerAs('profileConfig', () => ({
  apiKey: process.env.PROFILE_API_KEY || '',
}));

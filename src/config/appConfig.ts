import { registerAs } from '@nestjs/config';

const appConfig = () => ({
  environment: process.env.NODE_ENV || 'production',
});

export default registerAs('appConfig', appConfig);

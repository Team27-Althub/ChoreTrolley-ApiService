import { registerAs } from '@nestjs/config';

const appConfig = () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
});

export default registerAs('appConfig', appConfig);

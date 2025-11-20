import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: str({ default: '6h' }),
  PORT: num({ default: 8000 }),
  AWS_ACCEESS_KEY_ID: str(),
  AWS_SECRET_ACCEESS_KEY: str(),
  REGION: str(),
  AWS_S3_BUCKET_NAME: str(),
});

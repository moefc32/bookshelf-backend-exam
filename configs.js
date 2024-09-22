import 'dotenv/config';

export const APP_NAME = process.env.APP_NAME;
export const APP_HOST = process.env.APP_HOST || 'localhost';
export const APP_PORT = parseInt(process.env.APP_PORT, 10) || 3000;

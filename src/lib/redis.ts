import { Redis } from 'ioredis';

export const redis = new Redis({
  host: 'localhost',
  port: 6379,
  // password: 'mipassword', // solo si tienes contraseña
});
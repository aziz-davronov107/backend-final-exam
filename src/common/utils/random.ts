import { customAlphabet } from 'nanoid';

const numbersOnly = customAlphabet('0123456789', 6);

export function generateOtp(): string {
  return numbersOnly();
}
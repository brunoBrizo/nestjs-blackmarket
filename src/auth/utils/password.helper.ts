import * as bcrypt from 'bcrypt';
import { IsStrongPasswordOptions } from 'class-validator';

export const hashUserPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  storedPassword: string
) => {
  const valid = await bcrypt.compare(password, storedPassword);

  return valid;
};

export const strongPasswordOptions: IsStrongPasswordOptions = {
  minLength: 8,
  minLowercase: 1,
  minNumbers: 1,
  minUppercase: 1,
  minSymbols: 1
};

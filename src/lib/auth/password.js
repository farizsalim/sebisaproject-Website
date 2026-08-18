import bcrypt from "bcryptjs";

const PASSWORD_SALT_ROUNDS = 12;

export function hashPassword(password) {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

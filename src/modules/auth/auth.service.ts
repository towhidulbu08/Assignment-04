import bcrypt from "bcrypt";
import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { jwtUtils } from "../../utils/jwt";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "PROVIDER";
  phone?: string;
  address?: string;
}

export async function registerUser(input: RegisterInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (user) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    input.password,
    config.bcrypt_salt_rounds!,
  );
  // Extra safety: public register can never create an ADMIN,
  // even if the type/validation upstream is somehow bypassed.
  const safeRole: "CUSTOMER" | "PROVIDER" = input.role ?? "CUSTOMER";
  const newUser = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: safeRole,
      phone: input.phone,
      address: input.address,
    },
  });

  // Never send the password hash back to the client.
  const { password, ...safeUser } = newUser;

  return { user: safeUser };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "User Not Found");
  }

  if (user.status === "SUSPENDED") {
    throw new ApiError(403, "Your account has been suspended");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid  password");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const token = jwtUtils.signToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration as SignOptions,
  );
  const { password: _pw, ...safeUser } = user;

  return { token };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { password, ...safeUser } = user;
  return safeUser;
}

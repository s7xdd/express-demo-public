import * as bcrypt from "bcrypt";

import { decodeJwt } from "./jwt-functions";

export const comparePasswords = async ({
  plainPassword,
  hashedPassword,
}: {
  plainPassword: string;
  hashedPassword: string;
}): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

export const getJWTUserDetails = async (req: any) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const userDetails = await decodeJwt(token);
  return userDetails;
};

export const checkPermissionBlock = ({
  userDetails,
  requiredPermission,
}: {
  userDetails: any;
  requiredPermission: string;
}) => {
  if (userDetails && userDetails[requiredPermission] === true) {
    return true;
  }
  return false;
};

export const generateOtp = async (
  length = 4
): Promise<{
  otp: string;
  otpExpiry: Date;
}> => {
  if (length <= 0) {
    throw new Error("Length must be a positive integer.");
  }

  const currentDate = new Date();
  const otpExpiry = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000);

  let otp = "";
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10);
    otp += digit.toString();
  }

  return { otp, otpExpiry };
};

export const generateRandomPassword = (length = 12): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const character = characters.charAt(Math.floor(Math.random() * characters.length));
    password += character;
  }
  return password;
};

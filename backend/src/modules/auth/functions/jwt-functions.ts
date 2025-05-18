import jwt, { JwtPayload } from "jsonwebtoken";

import { UserProps } from "../types/auth-types";

export const generateJwt = (user: UserProps) => {
  const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_KEY!, {
    expiresIn: "1h",
  });

  return token;
};

export const decodeJwt = async (token: string): Promise<JwtPayload | null> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;
    return decoded;
  } catch (error: any) {
    console.error("Error decoding JWT:", error.message);
    return null;
  }
};

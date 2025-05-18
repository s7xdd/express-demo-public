import { Document } from "mongoose";

export interface UserProps extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  total_blogs?: number;
  is_verified?: boolean;
  otp: string;
  otp_expiry: Date;
  bio?: string;
  avatar_url?: string;
  is_admin?: boolean;
  is_google?: boolean;
  date_registered?: Date;
}

export interface GoogleAuthProps {
  provider: "google";
  sub: string;
  id: string;
  displayName: string;
  name: {
    givenName: string;
    familyName: string;
  };
  given_name: string;
  family_name: string;
  email_verified: boolean;
  verified: boolean;
  email: string;
  emails: Array<{ value: string; type?: string }>;
  photos: Array<{ value: string; type?: string }>;
  picture: string;
  _raw: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };
}



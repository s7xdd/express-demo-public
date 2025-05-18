import * as bcrypt from "bcrypt";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { userService } from "../services/user/user-service";
import { handleUserExistence } from "../../../shared/utils/helper/common-functions";
import { GoogleAuthProps } from "../types/auth-types";
import { otpServices } from "../services/otp/otp-services";
import { generateRandomPassword } from "../functions/auth-functions";

passport.serializeUser((username: any, done: any) => {
  done(null, username);
});

passport.deserializeUser(async (username: string, done: any) => {
  try {
    const { user: foundUser } = await handleUserExistence({
      username,
      throwNoUserExistsError: true,
    });
    done(null, foundUser);
  } catch (err) {
    done(err, undefined);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT!,
      clientSecret: process.env.GOOGLE_SECRET!,
      callbackURL: `${process.env.SERVER_BASE_URL}/api/v2/auth/google/callback`,
      passReqToCallback: true,
    },
    async (request: any, accessToken: any, refreshToken: any, profile: GoogleAuthProps, done: any) => {
      try {
        const email = profile.email;
        const username = profile.displayName;
        const avatar_url = profile.photos?.[0].value;

        let user = await userService.findUserByEmail({ email });

        console.log("useruseruser", user);

        if (!user) {
          const newUserData = {
            username,
            email,
            avatar_url,
            is_google: true,
            is_verified: true,
          };

          const otp = await otpServices.generateOtp();

          const hashedPassword = await bcrypt.hash(generateRandomPassword(), 10);

          user = await userService.createUser({
            ...newUserData,
            otp: otp.otp,
            otp_expiry: otp.otpExpiry,
            password: hashedPassword,
          });
        }

        return done(null, user?.username);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

import passport from "passport";
import { Strategy } from "passport-local";

import { handleUserExistence } from "../../../shared/utils/helper/common-functions";
import { comparePasswords } from "../../auth/functions/auth-functions";

passport.serializeUser((user: any, done) => {
    done(null, user.username);
});

passport.deserializeUser(async (username: string, done) => {
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

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const { user }: { user: any } = await handleUserExistence({
                username,
                throwNoUserExistsError: true,
            });

            const isValidPassword = await comparePasswords({
                plainPassword: password,
                hashedPassword: user.password,
            });

            if (!isValidPassword) {
                return done(null, false, { message: "Invalid credentials" });
            }

            if (!user.is_verified) {
                return done(null, false, { message: "User not verified" });
            }

            return done(null, user);
        } catch (err) {
            return done(err, undefined);
        }
    })
);

import { handleUserExistence } from "../../../../shared/utils/helper/common-functions";
import { generateOtp } from "../../functions/auth-functions";
import { UserProps } from "../../types/auth-types";
import { userService } from "../user/user-service";

export const otpServices = {
    async generateOtp(length = 4): Promise<{
        otp: string;
        otpExpiry: Date,
    }> {
        const otp = generateOtp(length);

        return otp;
    },
    async validateOtp({ userData, inputOtp }: { userData: UserProps, inputOtp: string }): Promise<boolean> {

        if (!(userData.otp) || new Date() > userData.otp_expiry) {
            return false;
        }

        if (userData.otp !== inputOtp) {
            return false;
        }

        return true;
    },

    async handleOtp({
        user,
        otpRequired,
    }: {
        user: UserProps;
        otpRequired?: boolean;
    }): Promise<null | { otp: string; userPayload: any }> {
        const requireOtp = otpRequired !== false;

        if (requireOtp && !user.is_verified) {
            const newOtp = await this.generateOtp();

            await userService.updateUser(user._id, {
                otp: newOtp.otp,
                otp_expiry: newOtp.otpExpiry,
            });

            const userPayload = {
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar_url: user.avatar_url,
                date_registered: user.date_registered,
                is_verified: user.is_verified,
            };

            return {
                otp: newOtp.otp,
                userPayload,
            };
        }

        return null;
    },

    async resendOtp({ username }: { username: string }) {
        const { user }: any = await handleUserExistence({
            username,
            throwNoUserExistsError: true,
            throwUserVerifiedError: true,
        });

        const newOtp = await this.generateOtp();

        await userService.updateUser(user._id, {
            otp: newOtp.otp,
            otp_expiry: newOtp.otpExpiry,
        });

        return {
            otp: newOtp.otp,
        };
    },

    async verifyOtp({ username, inputOtp }: { username: string, inputOtp: string }) {
        const { user }: any = await handleUserExistence({
            username,
            throwNoUserExistsError: true,
            throwUserVerifiedError: true,
        });

        const isOtpValid = await this.validateOtp({
            userData: user,
            inputOtp,
        });

        if (!isOtpValid) {
            throw new Error("Invalid OTP");
        }

        const updatedUser = await userService.updateUser(user._id, {
            is_verified: true,
        });

        return updatedUser;
    },

};


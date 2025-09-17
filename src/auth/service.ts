import User from "../user/entity";
import { utils } from "../utils";
import { ISignUp } from "./enum";

class AuthService {
  public async createUser(input: ISignUp) {

    const otp = utils.generateOtp();

    const user = new User({
      ...input,
      emailVerificationOtp: otp,
      //3600000 is in milisecs and this is 1hr, so the token is valid for 1 hour
      emailVerificationOtpExpiration: new Date(Date.now() + 3600000),
    });

    await user.save();

    return otp;
  }
}

export const authService = new AuthService();

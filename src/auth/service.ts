import mongoose from "mongoose";
import User from "../user/entity";
import { utils } from "../utils";
import { ISignUp, IVerifyEmail } from "./interface";

class AuthService {
  public async createUser(input: ISignUp) {

    const user = new User({
    ...input
    });

    await user.save();

    return user;
  }

  // public async registerUser(input: ISignUp) {
  //   const {
  //     email,
  //     accountType,
  //     address,
  //     city,
  //     country,
  //     dob,
  //     driversLicence,
  //     firstName,
  //    // initialDeposit,
  //     lastName,
  //     passportUrl,
  //     password,
  //     phoneNo,
  //     pin,
  //     ssn,
  //     userName,
  //     zipCode,
  //     state
  //   } = input;
  //   let user = await User.findOne({ email });

  //   if (user) {
  //     user.accountType = accountType;
  //     user.address = address;
  //     user.city = city;
  //     user.country = country;
  //     user.dob = dob;
  //     user.driversLicence = driversLicence;
  //     user.firstName = firstName;
  //   // user.initialDeposit = mongoose.Types.Decimal128.fromString(initialDeposit.toString());
  //     user.lastName = lastName;
  //     user.passportUrl = passportUrl;
  //     user.password = password;
  //     user.phoneNo = phoneNo;
  //     user.pin = pin;
  //     user.ssn = ssn;
  //     user.userName = userName;
  //     user.zipCode = zipCode;
  //     user.state = state;
  //     user.accountNumber = utils.generateAccNo()
  //    user = await user.save();
  //   }

  //   return user;
  // }

  public async validateOtp({ email, otp }: IVerifyEmail) {
    const otpValidity = await User.findOne({
      email: email,
      emailVerificationOtp: otp,
    });

    return otpValidity;
  }

  public async verifyEmail(email: string) {
    let user = await User.findOne({ email });

    if (user) {
      user.emailVerified = true;
      user.emailVerificationOtp = undefined;
      user.emailVerificationOtpExpiration = undefined;
      user = await user.save();
    }

    return user;
  }

  public async saveOtp(input: IVerifyEmail) {
    const { otp, email } = input;

    const user = await User.findOne({
      email: email,
    });

    user!.emailVerificationOtp = otp;
    //3600000 is in milisecs and this is 1hr, so the token is valid for 1 hour
    user!.emailVerificationOtpExpiration = new Date(Date.now() + 3600000);
    await user!.save();

    return user;
  }


        public async deleteOtp(email: string) {
        const user = await User.findOne({ email });
    
        if (user) {
          user.emailVerificationOtp = undefined;
          user.emailVerificationOtpExpiration = undefined;
          await user.save();
        }
        return user;
      }

      public async changePassword(email: string, password: string) {
        const user = await User.findOne({ email });
    
        if (user) {
          user.password = password;
          await user.save();
        }
        return user;
      }

}

export const authService = new AuthService();

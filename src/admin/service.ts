import Card from "../card/entity";
import Loan from "../loan/entity";
import Transaction from "../transaction/entity";
import User from "../user/entity";
import { AccountStatus } from "../user/enum";
import Admin from "./entity";
import { IAdminUserInput, IUpdateUserAccountStatus } from "./interface";

class AdminService {
  public async createAdmin(input: IAdminUserInput) {
    const { password, userName } = input;

    const admin = new Admin({
      password,
      userName,
    });

    const adminData = await admin.save();

    return adminData;
  }

  public async findAdminByUserNameAndPassword(input: IAdminUserInput) {
    const { password, userName } = input;

    const admin = await Admin.findOne({ userName, password }).select(
      "-password"
    );
    return admin;
  }

  public async fetchAllUsers() {
    const users = User.find().select(
      "-password -pin -emailVerificationOtp -emailVerificationOtpExpiration"
    );

    return users;
  }

  public async fetchLoans() {
    const loans = await Loan.find().populate(
      "userId",
      "-password -pin -emailVerificationOtp -emailVerificationOtpExpiration"
    );

    return loans;
  }

  public async fetchTransactions() {
    const loans = await Transaction.find().populate(
      "userId",
      "-password -pin -emailVerificationOtp -emailVerificationOtpExpiration"
    );

    return loans;
  }

  public async fetchCards() {
    const loans = await Card.find().populate(
      "userId",
      "-password -pin -emailVerificationOtp -emailVerificationOtpExpiration"
    );

    return loans;
  }

  public async findAdminById(id: string) {
    const admin = await Admin.findById(id);

    return admin;
  }


    public async updateUserStatus(input: IUpdateUserAccountStatus) {
    const { userId, status } = input;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { accountStatus: status } },
      { new: true }
    );

    return user;
  }

  // public async fetchAllTransfer() {
  //   const transfers = Transfer.find();

  //   return transfers;
  // }

  //   public async approveUser(userId: string) {
  //     const user = await User.findOneAndUpdate(
  //       { _id: userId },
  //       { $set: { status: AccountStatus.Active } },
  //       { new: true } // Return the updated document
  //     );

  //     return user;
  //   }

  //   public async deleteUser(userId: string) {
  //     const user = await User.findOneAndDelete({ _id: userId });

  //     return user;
  // }
}

export const adminService = new AdminService();

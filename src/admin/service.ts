import { ISignUp } from "../auth/interface";
import Card from "../card/entity";
import Loan from "../loan/entity";
import Transaction from "../transaction/entity";
import User from "../user/entity";
import { AccountStatus } from "../user/enum";
import Admin from "./entity";
import { IAdminCreateDomesticTransferUserInput, IAdminCreateWireTransferInput, IAdminUserInput, IUpdateUserAccountStatus, IUserUpdate } from "./interface";

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
      "-emailVerificationOtp -emailVerificationOtpExpiration"
    );

    return users;
  }

  public async fetchLoans() {
    const loans = await Loan.find().populate(
      "userId",
      "-emailVerificationOtp -emailVerificationOtpExpiration"
    );

    return loans;
  }

  public async fetchTransactions() {
    const loans = await Transaction.find().populate(
      "userId",
      "-emailVerificationOtp -emailVerificationOtpExpiration"
    );

    return loans;
  }

  public async fetchCards() {
    const loans = await Card.find().populate(
      "userId",
      "-emailVerificationOtp -emailVerificationOtpExpiration"
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

    public async updateUser(input: IUserUpdate, _id: string) {
    const user = await User.findOneAndUpdate(
      { _id }, // Query to find the user by ID
      {
        ...input,
      }, // Update the values
      { new: true } // Return the updated document
    );

    return user;
  }

    public async deleteTransaction(userId: string) {
      const transaction = await Transaction.findOneAndDelete({ _id: userId });

      return transaction;
  }

    public async deleteUser(userId: string) {
      const user = await User.findOneAndDelete({ _id: userId });

      return user;
  }

   public async adminCreateWireTransfer(input: IAdminCreateWireTransferInput) {
      let newTransaction = new Transaction({
        ...input,
      });
  
      await newTransaction.save();
  
      return;
    }

     public async adminCreateDomesticTransfer(input: IAdminCreateDomesticTransferUserInput) {
      let newTransaction = new Transaction({
        ...input,
      });
  
      await newTransaction.save();
  
      return;
    }
}

export const adminService = new AdminService();

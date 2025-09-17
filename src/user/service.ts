import mongoose, { Types } from "mongoose";

import User from "./entity";

class UserService {
  public async findUserByEmail(email: string) {

    const user = await User.findOne({
      email,
    });

    return user;
  }

  public async findUserByUserName(userName: string) {

    const user = await User.findOne({
      userName,
    });

    return user;
  }

}

export const userService = new UserService();

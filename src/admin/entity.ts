import mongoose from "mongoose";
import { IAdmin } from "./interface";



const Schema = mongoose.Schema;

const adminSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
},
 {
    timestamps: true
  }
);

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;

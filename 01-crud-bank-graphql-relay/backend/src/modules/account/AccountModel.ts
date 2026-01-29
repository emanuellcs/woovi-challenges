import mongoose, { Document, Schema } from "mongoose";

export interface IAccount extends Document {
  name: string;
  document: string; // CPF or CNPJ
  balance: number; // Stored in cents
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    document: {
      type: String,
      required: true,
      unique: true, // Enforce uniqueness at DB level
      trim: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true, // Auto-manage createdAt/updatedAt
    collection: "Account",
  },
);

export const AccountModel = mongoose.model<IAccount>("Account", AccountSchema);

import mongoose, { Document, Schema, Types } from "mongoose";

export enum TransactionTypeEnum {
  TRANSFER = "TRANSFER",
  DEPOSIT = "DEPOSIT", // Future use
}

export interface ITransaction extends Document {
  sourceAccount: Types.ObjectId;
  destinationAccount: Types.ObjectId;
  amount: number; // Cents
  type: TransactionTypeEnum;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema(
  {
    sourceAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    destinationAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1, // Minimum 1 cent
    },
    type: {
      type: String,
      enum: Object.values(TransactionTypeEnum),
      default: TransactionTypeEnum.TRANSFER,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Transactions are immutable usually
    collection: "Transaction",
  },
);

export const TransactionModel = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema,
);

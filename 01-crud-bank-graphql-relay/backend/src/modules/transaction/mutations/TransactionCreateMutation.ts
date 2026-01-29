import { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLID } from "graphql";
import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { TransactionModel, TransactionTypeEnum } from "../TransactionModel";
import { TransactionType } from "../TransactionType";
import { AccountModel } from "../../account/AccountModel";
import mongoose from "mongoose";

interface TransferInput {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  description?: string;
}

export const TransactionCreateMutation = mutationWithClientMutationId({
  name: "TransactionCreate",
  inputFields: {
    sourceAccountId: { type: new GraphQLNonNull(GraphQLID) },
    destinationAccountId: { type: new GraphQLNonNull(GraphQLID) },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    description: { type: GraphQLString },
  },
  outputFields: {
    transaction: {
      type: TransactionType,
      resolve: (payload) => payload,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
  mutateAndGetPayload: async ({
    sourceAccountId,
    destinationAccountId,
    amount,
    description,
  }: TransferInput) => {
    // Validation
    if (amount <= 0) {
      return { error: "Amount must be positive" };
    }

    const { id: sourceDbId } = fromGlobalId(sourceAccountId);
    const { id: destDbId } = fromGlobalId(destinationAccountId);

    if (sourceDbId === destDbId) {
      return { error: "Cannot transfer to the same account" };
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Fetch Accounts (with write lock logic if needed, but atomic updates are better)
      const sourceAccount =
        await AccountModel.findById(sourceDbId).session(session);
      const destAccount =
        await AccountModel.findById(destDbId).session(session);

      if (!sourceAccount || !destAccount) {
        await session.abortTransaction();
        return { error: "One or both accounts not found" };
      }

      if (sourceAccount.balance < amount) {
        await session.abortTransaction();
        return { error: "Insufficient funds" };
      }

      // Execute Transfer (Atomic Operations)

      // Debit Source
      sourceAccount.balance -= amount;
      await sourceAccount.save({ session });

      // Credit Destination
      destAccount.balance += amount;
      await destAccount.save({ session });

      // Record Transaction
      const transaction = new TransactionModel({
        sourceAccount: sourceDbId,
        destinationAccount: destDbId,
        amount,
        type: TransactionTypeEnum.TRANSFER,
        description,
      });

      await transaction.save({ session });

      // Commit
      await session.commitTransaction();
      return transaction;
    } catch (err) {
      console.error("Transfer failed:", err);
      await session.abortTransaction();
      return { error: "Transfer failed due to internal error" };
    } finally {
      session.endSession();
    }
  },
});

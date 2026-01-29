import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from "graphql";
import {
  globalIdField,
  connectionArgs,
  connectionFromPromisedArray,
} from "graphql-relay";
import { IAccount } from "./AccountModel";
import { nodeInterface } from "../../core/graphql/NodeInterface";
import { TransactionConnection } from "../transaction/TransactionType";
import { TransactionModel } from "../transaction/TransactionModel";

export const AccountType = new GraphQLObjectType<IAccount>({
  name: "Account",
  description: "Represents a bank account with a balance",
  interfaces: [nodeInterface], // Implements Relay Node interface
  fields: () => ({
    id: globalIdField("Account"), // Hashed ID (e.g., "Account:123")
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (account) => account.name,
    },
    document: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The CPF or CNPJ of the account holder",
      resolve: (account) => account.document,
    },
    balance: {
      type: new GraphQLNonNull(GraphQLInt), // Int is safe for cents
      description: "Current balance in cents",
      resolve: (account) => account.balance,
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (account) => account.createdAt.toISOString(),
    },
    transactions: {
      type: TransactionConnection,
      args: connectionArgs,
      resolve: async (account, args) => {
        // Fetch transactions where this account is either source or destination.
        // "args.first" is assumed to be reasonable.
        // In production, enforce a hard limit (e.g., max 50).
        const limit = args.first || 20;

        // connectionFromPromisedArray expects the full array to slice correctly.
        // For a challenge, this is acceptable. For production, we'd build a custom 'connectionFromMongoCursor'.
        const query = TransactionModel.find({
          $or: [
            { sourceAccount: account._id },
            { destinationAccount: account._id },
          ],
        }).sort({ createdAt: -1 }); // Newest first

        return connectionFromPromisedArray(query.exec(), args);
      },
    },
  }),
});

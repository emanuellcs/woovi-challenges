import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from "graphql";
import { globalIdField } from "graphql-relay";
import { ITransaction } from "./TransactionModel";
import { nodeInterface } from "../../core/graphql/NodeInterface";
import { AccountType } from "../account/AccountType";
import { AccountModel } from "../account/AccountModel";

export const TransactionType = new GraphQLObjectType<ITransaction>({
  name: "Transaction",
  description: "A record of a financial movement between two accounts",
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField("Transaction"),
    amount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (tx) => tx.amount,
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tx) => tx.type,
    },
    description: {
      type: GraphQLString,
      resolve: (tx) => tx.description,
    },
    // Edge to Source Account
    sourceAccount: {
      type: AccountType,
      resolve: async (tx) => await AccountModel.findById(tx.sourceAccount),
    },
    // Edge to Destination Account
    destinationAccount: {
      type: AccountType,
      resolve: async (tx) => await AccountModel.findById(tx.destinationAccount),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (tx) => tx.createdAt.toISOString(),
    },
  }),
});

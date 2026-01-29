import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { AccountCreateMutation } from "../modules/account/mutations/AccountCreateMutation";
import { nodeField, nodesField } from "../core/graphql/NodeInterface";
import { AccountType } from "../modules/account/AccountType";
import { AccountModel } from "../modules/account/AccountModel";
import { TransactionCreateMutation } from "../modules/transaction/mutations/TransactionCreateMutation";
import { TransactionType } from "../modules/transaction/TransactionType";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    // Required for Relay
    node: nodeField,
    nodes: nodesField,
    // Simple helper to fetch all accounts for testing (not Relay standard, but useful for now)
    accounts: {
      type: require("graphql").GraphQLList(AccountType),
      resolve: () => AccountModel.find({}),
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    accountCreate: AccountCreateMutation,
    transactionCreate: TransactionCreateMutation,
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  types: [AccountType, TransactionType], // Explicitly provide types to resolve interfaces
});

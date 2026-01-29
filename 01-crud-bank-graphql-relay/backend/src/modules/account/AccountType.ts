import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from "graphql";
import { globalIdField } from "graphql-relay";
import { IAccount } from "./AccountModel";
import { nodeInterface } from "../../core/graphql/NodeInterface";

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
  }),
});

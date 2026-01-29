import { GraphQLString, GraphQLNonNull } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { AccountModel } from "../AccountModel";
import { AccountType } from "../AccountType";

export const AccountCreateMutation = mutationWithClientMutationId({
  name: "AccountCreate",
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    document: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    account: {
      type: AccountType,
      resolve: (payload) => payload, // The payload is the created account
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error, // Return error message if exists
    },
  },
  mutateAndGetPayload: async ({ name, document }) => {
    try {
      // Check for existing account
      const existing = await AccountModel.findOne({ document });
      if (existing) {
        return { error: "Account with this document already exists" };
      }

      const account = new AccountModel({
        name,
        document,
        balance: 0, // Start with 0
      });

      await account.save();

      return account;
    } catch (err) {
      console.error("Error creating account:", err);
      return { error: "Internal Server Error" };
    }
  },
});

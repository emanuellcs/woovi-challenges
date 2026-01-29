import { nodeDefinitions, fromGlobalId } from "graphql-relay";
import { AccountModel } from "../../modules/account/AccountModel";
import { TransactionModel } from "../../modules/transaction/TransactionModel";

/*
 nodeDefinitions returns the Node interface and the nodeField.
 It requires a way to fetch an object by ID (idFetcher) and a way to resolve the type of that object (typeResolver).
*/
export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  // idFetcher
  // Given a global ID, find the object
  async (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === "Account") {
      return await AccountModel.findById(id);
    }

    if (type === "Transaction") {
      return await TransactionModel.findById(id);
    }

    // Future: Add Transaction case here
    return null;
  },

  // typeResolver
  // Given an object, return its GraphQL type
  (obj) => {
    // Check properties to determine type.
    // In a larger application, one could use "instanceof" or a discriminator field.
    if (obj.document && obj.balance !== undefined) {
      // This needs to be loaded asynchronously to avoid circular dependencies.
      // For now, it returns a name in string format, which graphql-js processes if the type is in the schema map.
      return "Account";
    }

    if (obj.amount != undefined && obj.sourceAccount) {
      return "Transaction";
    }

    return null;
  },
);

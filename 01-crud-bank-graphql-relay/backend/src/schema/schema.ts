// Placeholder schema

import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    health: {
      type: GraphQLString,
      resolve: () => "OK",
    },
  },
});

export const schema = new GraphQLSchema({
  query: Query,
});

import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { graphqlHTTP } from "koa-graphql";
import { schema } from "./schema/schema";
import { connectDatabase } from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const app = new Koa();
const router = new Router();

const start = async () => {
  await connectDatabase();

  app.use(bodyParser());
  app.use(cors());

  // GraphQL Endpoint
  router.all(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true, // Enable GraphiQL for testing
    }),
  );

  app.use(router.routes()).use(router.allowedMethods());

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
};

start();

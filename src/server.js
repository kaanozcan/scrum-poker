import "babel-polyfill";
import path from "path";
import express from "express";
import config from "config";
import bodyParser from "body-parser";
import favicon from "serve-favicon";
import session from "express-session";
import { createServer } from "http";

import siteRenderer from "./middlewares/siteRenderer";

import { ApolloServer } from "apollo-server-express";
import schema from "./schema";

const SERVER_PORT = config.get("server.port");

const apolloServer = new ApolloServer({
  tracing: true,
  schema,
  playground: true,
  subscriptions: "/subscriptions",
  formatError: error => {
    console.log("formatError", error);

    return error;
  },
  context: ({ req, res, next }) => ({
    request: req,
    response: res,
    next
  })
});

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));

server.use(bodyParser.json());

server.use(session({
  name: "express-session",
  secret: "cats",
  resave: true,
  saveUninitialized: true
}));

apolloServer.applyMiddleware({
  app: server,
  path: "/api/graphql"
});

server.use("/assets", express.static(path.join(__dirname, "../public"), {
  index: false,
  fallthrough: false
}));

server.use(favicon(path.join(__dirname, "../../public/favicon/favicon.ico")));

server.use("/", siteRenderer);

const httpServer = createServer(server);

apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(SERVER_PORT, () => {
  console.log(`server on port: ${SERVER_PORT}`);
  console.log(`graphql path: ${apolloServer.graphqlPath}`);
  console.log(`subscriptions path: ${apolloServer.subscriptionsPath}`);
});

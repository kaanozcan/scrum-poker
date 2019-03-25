import { ApolloClient, addTypename } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { getMainDefinition } from "apollo-utilities";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-fetch";
import { Agent } from "https";
import { BatchHttpLink } from "apollo-link-batch-http";
import { withClientState } from "apollo-link-state";
import { SchemaLink } from 'apollo-link-schema';

const nodeEnv = {
  isTest: process.env.NODE_ENV === "test",
  isDevevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production"
}

const getBaseUrl = (baseUrl) => {
  if (process.env.browser) {
    const { protocol, hostname, port } = window.location;

    return `${protocol}//${hostname}${port ? ":" + port : ""}`;
  }

  return baseUrl;
}

const getLink = (baseDomain, graphqlSubscriptionUrl, clientStateDefaults, clientStateCache) => {
  let httpFetchOptions = {
    batchInterval: 25,
    credentials: "include"
  };

  const baseUrl = getBaseUrl(baseDomain);

  let httpLinkOptions = {
    uri: baseUrl + "/api/graphql",
    fetchOptions: httpFetchOptions,
    fetch: fetch
  };

  if (!process.env.browser) {
    httpLinkOptions.headers = {
      Origin: "http://localhost:3000"
    };
  }

  const httpLink = new BatchHttpLink(httpLinkOptions);

  const errorLink = onError(({ operation, forward}) => forward(operation));

  const clientStateLink = withClientState({
    cache: clientStateCache,
    defaults: clientStateDefaults,
    resolvers: {}
  });

  const link = errorLink.concat(clientStateLink).concat(httpLink);

  if (process.env.browser) {
      const wsLink = new WebSocketLink({
        uri: "ws://localhost:3000/subscriptions",
        options: {
          reconnect: true,
          timeout: 5000
        }
      });

      return split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);

          return kind === "OperationDefinition" && operation === "subscription";
        },
        wsLink,
        link
      );
    }

    return link;
};

const getMemoryCache = (initialData) => {
  const memoryCache = new InMemoryCache({
    dataIdFromObject: (data) => {
      if (data.id) {
        return `${data.__typename}(${data.id})`;
      } else {
        return null;
      }
    }
  });

  if (initialData) {
    memoryCache.restore(initialData);
  }

  return memoryCache;
};

export default ({ context, baseUrl, initialData, graphqlSubscriptionUrl, ssrMode = false, clientStateDefaults }) => {
  const cache = getMemoryCache(initialData),
        link = process.env.browser
          ? getLink(baseUrl, graphqlSubscriptionUrl, clientStateDefaults, cache)
          : new SchemaLink({ schema: require("src/schema").default, context });

  const apolloClient = new ApolloClient({
    ssrMode,
    link,
    cache
  });

  return apolloClient;
};

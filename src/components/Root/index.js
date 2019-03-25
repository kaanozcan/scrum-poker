import React, { Components } from "react";
import App from "./App";
import { Route } from "react-router";
import { ApolloProvider } from "react-apollo";
import ErrorBoundary from "lib/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import Helmet from "react-helmet-async";


const getRouter = () => {
  if (process.env.browser === true) {
    return require("react-router-dom").BrowserRouter;
  } else {
    return require("react-router").StaticRouter;
  }
};

export default ({ location, helmetContext, routerContext, apolloClient }) => {
  const Router = getRouter();

  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <HelmetProvider context={helmetContext}>
          <Helmet>
            <meta charset="utf-8" />
            
            <link type="text/css" rel="stylesheet" href="/assets/vendor/antd/dist/antd.css" />
            <script src={`/assets/bundle/vendor.js`} />
            <script src={`/assets/bundle/bundle.js`} />
          </Helmet>

          <Router location={location} context={routerContext}>
            <Route match="/" component={App} />
          </Router>

        </HelmetProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

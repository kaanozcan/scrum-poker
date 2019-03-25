import React from "react";
import { renderToString } from "react-dom/server";
import createApolloClient from "lib/utils/apollo-client";
import { renderToStringWithData } from "react-apollo";
import Root from "src/components/Root";
import config from "config";

const getDocument = (markup, helmetContext) => {
  return `
    <!DOCTYPE html>
    <html lang="tr" dir="ltr">
      <head>
          <!-- Meta -->
          ${helmetContext.helmet.meta.toString()}
          <!-- Title -->
          ${helmetContext.helmet.title.toString()}
          <!-- Script -->
          ${helmetContext.helmet.script.toString()}
          <!-- Link -->
          ${helmetContext.helmet.link.toString()}

      </head>
      <body>
        <div id="app-root" style="height:100%;">
          ${markup}
        </div>
      </body>
    </html>
  `;
}

export default function siteRenderer (req, res, next) {
  const routerContext = {},
      helmetContext = {},
      apolloContext = {
        request: req,
        response: res,
        next
      };

  const apolloClient = createApolloClient({
    baseUrl: config.get("server.host"),
    ssrMode: true,
    context: apolloContext
  });

  renderToStringWithData(
    <Root location={req.url}
      routerContext={routerContext}
      helmetContext={helmetContext}
      apolloClient={apolloClient}
    />
  ).then((markup) => {
    if (routerContext.url) {
      return res.redirect(302, routerContext.url);
    }

    const document = getDocument(markup, helmetContext);

    res.status(200).send(document);
  });
}

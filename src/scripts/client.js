import "babel-polyfill";
import React from "react";
import ReactDom from "react-dom";
import Root from "src/components/Root";
import createApolloClient from "lib/utils/apollo-client";

__webpack_public_path__ = window.location.origin + "/assets/bundle/";

/**
 *
 * @constructor
 */
function DOMContentLoaded () {
  const element = document.getElementById("app-root");

  const apolloState = JSON.parse(decodeURIComponent(element.getAttribute("data-apollo-state")));

  const apolloClient = createApolloClient({
    initialData: apolloState
  });

  ReactDom.hydrate(
    <Root apolloClient={apolloClient} />,
    element
  );

}

document.addEventListener("DOMContentLoaded", DOMContentLoaded);

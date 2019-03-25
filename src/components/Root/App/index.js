import React, { Component, useState } from "react";
import { Route, Switch } from "react-router";
import { Redirect } from "react-router-dom";
import Header from "lib/components/header";

import Landing from "./Landing";
import Plan from "./Plan";

export const App  = () => (
  <div>
    <Header />
    <Switch>
      <Route path="/plan" component={Plan} />
      <Route path="/" component={Landing} />
    </Switch>
  </div>
);

export default App;

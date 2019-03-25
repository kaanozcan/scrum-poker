import React from "react";
import { Route, Switch } from "react-router";

import Create from "./Create";
import Vote from "./Vote";
import List from "./List";

const Plan = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}/create`} component={Create}/>
      <Route path={`${match.url}/vote/:id`} component={Vote}/>
      <Route component={List}/>
    </Switch>
  );
}

export default Plan;

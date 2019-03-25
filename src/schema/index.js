import { bundle } from "graphql-modules";
import { makeExecutableSchema } from "graphql-tools";

import Plan from "./Plan";

const modules = bundle([
  Plan,
]);

export default makeExecutableSchema(modules);

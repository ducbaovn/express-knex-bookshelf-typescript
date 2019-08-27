import * as sourceMapSupport from "source-map-support";
import Application from "./app";
import { Configuration } from "./libs";

if (process.env.NODE_ENV !== "production") {
    sourceMapSupport.install();
}
// Bootstrap new app
new Application().listen(Configuration.port);

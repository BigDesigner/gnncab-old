import path from "node:path";
import config from "./orval.config";

const outputRoot = path.resolve(__dirname, "../../tmp/codegen-smoke");

export default {
  "api-client-react": {
    ...config["api-client-react"],
    output: {
      ...config["api-client-react"].output,
      workspace: path.join(outputRoot, "client"),
    },
  },
  zod: {
    ...config.zod,
    output: {
      ...config.zod.output,
      workspace: path.join(outputRoot, "zod"),
      schemas: { path: "generated/types", type: "typescript" },
    },
  },
};

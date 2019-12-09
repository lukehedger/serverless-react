import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";

export default {
  external: [
    "child_process",
    "crypto",
    "fs",
    "http",
    "https",
    "os",
    "path",
    "stream",
    "url"
  ],
  input: "lib/session.ts",
  output: [
    {
      file: "lib/session.js",
      format: "cjs"
    }
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs({
      namedExports: {
        "@aws-sdk/client-dynamodb-node": [
          "BatchWriteItemCommand",
          "DynamoDBClient"
        ]
      }
    }),
    typescript()
  ],
  watch: {
    clearScreen: false
  }
};

// @ts-check
const { derefSchemaPath } = require("./deref-json-schema");
const fs = require("fs");

const schemasPath = "schemas";

function schemas() {
  return fs
    .readdirSync(schemasPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => `${schemasPath}/${file}`);
}

/** @returns {import('@docusaurus/types').Plugin}  */
module.exports = function derefJsonSchemas(context, options) {
  return {
    name: "deref-json-schemas",
    async loadContent() {},
    async contentLoaded({ content, actions }) {},
    async postBuild(props) {
      console.log("Building schemas...");
      const outDir = `${props.outDir}/${schemasPath}`;
      fs.mkdirSync(outDir, { recursive: true });
      for (const schemaPath of schemas()) {
        const schema = await derefSchemaPath(schemaPath);
        fs.writeFileSync(
          `${props.outDir}/${schemaPath}`,
          JSON.stringify(schema),
        );
        console.log(`Wrote ${schemaPath}.`);
      }
    },
    /** @returns {any} devServer is missing from the webpack config definition? */
    configureWebpack() {
      return {
        devServer: {
          onBeforeSetupMiddleware(devServer) {
            devServer.app.get(
              `/${schemasPath}/:schemaId`,
              async (req, resp) => {
                console.log("resolving", req.path);
                const schema = await derefSchemaPath(req.path.slice(1));
                if (schema) {
                  resp
                    .status(200)
                    .type("json")
                    .send(JSON.stringify(schema, null, 2));
                } else {
                  resp.sendStatus(404);
                }
              },
            );
          },
        },
      };
    },
    getPathsToWatch() {
      return [
        `${context.siteDir}/${schemasPath}`,
        `${context.siteDir}/src/plugins/deref-json-schemas`,
      ];
    },
  };
};

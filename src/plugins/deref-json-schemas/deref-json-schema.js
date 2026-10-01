// @ts-check
const $RefParser = require("@stoplight/json-schema-ref-parser");

// use global parser to avoid re-resolving paths that we've already seen in previous schemas
const parser = new $RefParser();

async function derefSchemaPath(schemaPath) {
  // TODO bundle instead?
  await parser.dereference(schemaPath);
  return parser.schema;
}

module.exports = {
  derefSchemaPath,
};

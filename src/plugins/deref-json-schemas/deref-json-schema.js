// @ts-check
const { Resolver } = require("@stoplight/json-ref-resolver");
const { resolveHttp } = require("@stoplight/json-ref-readers");
const { merge, mergeWithCustomize } = require("webpack-merge");
const fs = require("fs");

const schemasPath = "schemas";

function resolveFile(path) {
  path = String(path);
  if (path.startsWith("/")) {
    path = path.slice("/");
  } else {
    path = `${schemasPath}/${path}`;
  }

  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

const resolver = new Resolver({
  resolvers: {
    https: { resolve: resolveHttp },
    http: { resolve: resolveHttp },
    file: { resolve: resolveFile },
  },
});

const mergeCustomized = mergeWithCustomize({
  customizeArray(resolved, original, key) {
    return original;
  },
  customizeObject(resolved, original, key) {
    const { $ref: _originalRef, ...originalClean } = original;
    return mergeCustomized(resolved, originalClean);
  },
});

async function derefJsonSchema(schema) {
  const { result: resolved } = await resolver.resolve(schema);
  const { $defs, _resolvedDefs, ...resolvedClean } = resolved;
  const { $ref: _ref, $defs: _schemaDefs, ...schemaClean } = schema;
  return mergeCustomized(resolvedClean, schemaClean);
}

async function derefSchemaPath(schemaPath) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  return await derefJsonSchema(schema);
}

module.exports = {
  schemasPath,
  derefJsonSchema,
  derefSchemaPath,
};

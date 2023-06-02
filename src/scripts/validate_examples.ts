import * as fs from "node:fs";
import Ajv from "ajv/dist/2020";
import addFormats from "ajv-formats";

const ajvOpts = { strict: true };
const ajv = new Ajv(ajvOpts);
addFormats(ajv);

let fail = false;

console.log("loading schemas...");
const schemas: { [schemaFileName: string]: any } = {};
fs.readdirSync("schemas/").forEach((schemaFileName) => {
  if (!schemaFileName.endsWith(".json")) {
    console.log(`skipping schemas/${schemaFileName}, not a json file`);
    return;
  }
  let schema;
  try {
    schema = JSON.parse(
      fs.readFileSync(`schemas/${schemaFileName}`).toString()
    );
  } catch (e) {
    fail = true;
    console.error(`\nerror: schemas/${schemaFileName} is not valid JSON`);
    console.error(e);
    console.error("");
    return;
  }
  if (!schema.$id || !schema.$id.endsWith(schemaFileName)) {
    fail = true;
    console.error(
      `error: schemas/${schemaFileName} $id "${schemas.$id}" does not match filename`
    );
    return;
  }
  // doesn't compile or check the schema yet
  ajv.addSchema(schema, schemaFileName);
  schemas[schemaFileName] = schema;
  console.log(`loaded schemas/${schemaFileName}`);
});

if (fail) {
  console.log("errors in schemas, skipping compilation");
  process.exit(1);
}
console.log("compiling schemas...");

// Check that schemas compile after adding all of them, so that references can be resolved.
Object.entries(schemas).forEach(([schemaFileName, schema]) => {
  try {
    ajv.compile(schema);
  } catch (e) {
    fail = true;
    console.error(
      `\nerror: schemas/${schemaFileName} is not a valid JSON Schema`
    );
    console.error(e);
    console.error("");
    return;
  }
});

if (fail) {
  console.log("errors in schemas, skipping example validation");
  process.exit(1);
}

console.log("validating examples...");
fs.readdirSync("examples/").forEach((eventName) => {
  const schemaFileName = `${eventName}.json`;
  if (!(schemaFileName in schemas)) {
    console.log(
      `skipping examples/${eventName}/, no matching JSON Schema in schemas/${schemaFileName}`
    );
    return;
  }

  fs.readdirSync(`examples/${eventName}/`).forEach((exampleName) => {
    const exampleFileName = `examples/${eventName}/${exampleName}`;
    if (!exampleName.endsWith(".json")) {
      console.log(`skipping ${exampleFileName}, not a json file`);
      return;
    }
    const exampleFile = fs.readFileSync(exampleFileName).toString();
    let exampleData;
    try {
      exampleData = JSON.parse(exampleFile);
    } catch (e) {
      fail = true;
      console.error(`\nerror: ${exampleFileName} is not valid JSON`);
      console.error(e);
      console.error("");
      return;
    }
    if (!Array.isArray(exampleData)) {
      exampleData = [exampleData];
    }
    let failFile = false;
    (exampleData as Array<unknown>).forEach((example, index) => {
      if (!ajv.validate(schemaFileName, example)) {
        fail = true;
        failFile = true;
        console.error(
          `\nerror: ${exampleFileName}[${index}] is not valid according to schemas/${schemaFileName}`
        );
        console.error(ajv.errors);
        return;
      }
    });
    if (failFile) {
      console.error("");
      return;
    }
    console.log(`validated ${exampleFileName}`);
  });
});

if (fail) {
  process.exit(1);
}
console.log("Tests passed!");

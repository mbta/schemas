import * as fs from "node:fs";
import Ajv from "ajv/dist/2020";

const ajvOpts = { strict: true };

let fail = false;
fs.readdirSync("examples/").forEach((schemaName) => {
  const schemaFileName = `schemas/${schemaName}.json`;
  if (!fs.existsSync(schemaFileName)) {
    console.log(`skipping examples/${schemaName}/, no matching JSON Schema`);
    return;
  }
  console.log(`validating ${schemaName}...`);
  const schemaFile = fs.readFileSync(schemaFileName).toString();
  let schema;
  try {
    schema = JSON.parse(schemaFile);
  } catch (e) {
    fail = true;
    console.error(`${schemaFileName} is not valid JSON`);
    console.error(e);
    return;
  }
  const ajv = new Ajv(ajvOpts);
  let validate: ReturnType<Ajv["compile"]>;
  try {
    validate = ajv.compile(schema);
  } catch (e) {
    fail = true;
    console.error(`${schemaFileName} is not a valid JSON schema`);
    console.error(e);
    return;
  }
  // example files are lists of examples, so we need a schema to unwrap the array
  fs.readdirSync(`examples/${schemaName}/`).forEach((exampleName) => {
    const exampleFileName = `examples/${schemaName}/${exampleName}`;
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
      console.error(`${exampleFileName} is not valid JSON`);
      console.error(e);
      return;
    }
    if (!Array.isArray(exampleData)) {
      fail = true;
      console.error(`${exampleFileName} is not an array of examples.`);
    }
    let failFile = false;
    (exampleData as Array<unknown>).forEach((example, index) => {
      if (!validate(example)) {
        fail = true;
        failFile = true;
        console.error(
          `${exampleFileName}[${index}] is not valid according to ${schemaFileName}`
        );
        console.error(validate.errors);
        return;
      }
    });
    if (failFile) {
      return;
    }
    console.log(`${exampleFileName} is valid`);
  });
});

if (fail) {
  process.exit(1);
}

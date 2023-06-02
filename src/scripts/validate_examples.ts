import * as fs from "node:fs";
import Ajv from "ajv/dist/2020";
import addFormats from "ajv-formats";

const ajvOpts = { strict: true };

let fail = false;

const schemas: { [schemaFileName: string]: any } = {};
fs.readdirSync("schemas/").forEach((schemaFileName) => {
  if (!schemaFileName.endsWith(".json")) {
    console.log(`skipping schemas/${schemaFileName}, not a json file`);
    return;
  }
  try {
    schemas[schemaFileName] = JSON.parse(
      fs.readFileSync(`schemas/${schemaFileName}`).toString(),
    );
    // TODO check that id matches name?
  } catch (e) {
    fail = true;
    console.error(`\nerror: schemas/${schemaFileName} is not valid JSON`);
    console.error(e);
    console.error("");
  }
});

fs.readdirSync("examples/").forEach((schemaName) => {
  const schemaFileName = `${schemaName}.json`;
  if (!(schemaFileName in schemas)) {
    console.log(
      `skipping examples/${schemaName}/, no matching JSON Schema in schemas/${schemaFileName}`,
    );
    return;
  }
  console.log(`validating ${schemaName}...`);
  const ajv = new Ajv(ajvOpts);
  addFormats(ajv);
  Object.entries(schemas).forEach(([schemaFileName, schema]) => {
    //if (filename != schemaFileName) {
    // TODO should you skip schema under test?
    // TODO do you need to specify filename?
    // TODO try/catch for each?
    ajv.addSchema(schema, schemaFileName);
    //}
  });

  const schema = schemas[schemaFileName];
  let validate: ReturnType<Ajv["compile"]>;
  try {
    validate = ajv.compile(schema);
  } catch (e) {
    fail = true;
    console.error(`\nerror: ${schemaFileName} is not a valid JSON schema`);
    console.error(e);
    console.error("");
    return;
  }
  // example files are either a single example or list of examples, so we need a schema to unwrap the array
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
      exampleData = [exampleData];
    }
    let failFile = false;
    (exampleData as Array<unknown>).forEach((example, index) => {
      if (!validate(example)) {
        fail = true;
        failFile = true;
        console.error(
          `${exampleFileName}[${index}] is not valid according to ${schemaFileName}`,
        );
        console.error(validate.errors);
        return;
      }
    });
    if (failFile) {
      console.error("");
      return;
    }
    console.log(`${exampleFileName} is valid`);
  });
});

if (fail) {
  process.exit(1);
}

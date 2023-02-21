# MBTA Schemas

A collection of schemas for inter-app interchange formats. Schemas in this repository should stay up to date if they change.

Schemas go in the `schemas/` folder.

Examples go in the `examples/<schema>/` folders.

## Development

A few npm scripts are included in order to validate the schemas.

### Installation

```
asdf plugin install nodejs
asdf install
npm ci
```

### Tests

JSON Schema examples are validated against their schemas by `npm run test:json:validate`.

The test script assumes:

- The schema is located at `schemas/<schema>.json`.
- Each example file `examples/<schema>/*.json` is an array of valid examples.

### Scripts

- `npm run format`: Format all json files with prettier
- `npm test`: Runs all tests:
  - All files are formatted
  - All JSON Schemas are valid schemas
  - All examples for JSON Schemas are valid for their schema.

`npx ajv` ([docs](https://github.com/ajv-validator/ajv-cli)) has additional commands to validate that data matches a JSON Schema. Use the `--spec=draft2020` option.

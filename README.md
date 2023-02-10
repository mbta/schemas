# MBTA Schemas

A collection of schemas for inter-app interchange formats. Schemas in this repository should stay up to date if they change.

Schemas go in the `schemas/` folder.

## Development

A few npm scripts are included in order to validate the schemas.

### Installation

```
asdf plugin install nodejs
asdf install
npm ci
```

### Scripts

- `npm run format`: Format all json files with prettier
- `npm test`: Test that all schemas are valid JSON Schemas (and are formatted)

`npx ajv` ([docs](https://github.com/ajv-validator/ajv-cli)) has additional commands to validate that data matches a JSON Schema. Use the `--spec=draft2020` option.

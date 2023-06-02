# MBTA Event Schemas

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ asdf install
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Testing

To check that the schemas in `schemas/` and the examples in `examples/` are valid:

``` shell
$ yarn test:schemas
```

Each file `examples/<schema name>/<example name>.json` is validated against the schema `schemas/<schema name>.json`.

To run all tests:

``` shell
$ yarn ci
# or
$ yarn test
```

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Deployment happens via [Github Actions](https://github.com/mbta/schemas/actions).

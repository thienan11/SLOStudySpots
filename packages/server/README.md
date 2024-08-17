# Server

This package implements an Express server which provides the
endpoints for our REST API, as well as serving the HTML/CSS/JS
for either the Prototype or our App.

## Running

Ensure you are in the `packages/server` directory to execute the following commands.

Make sure to have all dependencies installed before running.

To start the server in development mode:

```shell
npm run dev
```

To build the Express server for production:

```shell
npm run build
```

To build and start the server without a frontend:

```shell
npm run start
```

To build and start the server with the Prototype as the frontend:

```shell
npm run start:proto
```

To build and start the server with the SPA as the frontend:

```shell
npm run start:app
```

## Documentation

The source files for the server are written in TypeScript. This
allows us to provide typesafe interfaces to MongoDB, and
ultimately provide some type safety for the REST API. They are
organized into the following directories:

- [models](src/models): TypeScript interfaces for each type of
  data we are handling.
- [services](src/services): Backend services which are invoked
  from the endpoints. Many of these interface (via mongoose)
  with MongoDB to persist data.
- [routes](src/routes): Implementation of endpoints for the REST
  API.

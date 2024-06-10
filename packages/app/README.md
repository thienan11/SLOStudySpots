# App

This package implements a single-page application (SPA), built on the Model-View-Update (MVU) architecture using mu-store for state management and type safety. It utilizes Lit for rendering the DOM, reacting dynamically to changes in the model. The application structure is modular, with multiple LitElement components that pass data via slots, attributes, and reactive properties. Client-side routing is managed through mu-switch, allowing URL-dependent view rendering. The system's behavior contains a series of custom Msgs, extending the update function to handle application-specific logic.

## Running

Make sure to have all dependencies installed before running.

For development, run the following command in the directory `packages/app`:

```shell
npm run dev
```
In a separate terminal, navigate to `packages/server` and execute:

```shell
npm run start
```

These commands will activate both the frontend and backend servers, setting up the full environment for development and testing.

## NOTE (features not implemented yet)
- No image uploads (for profiles and study spots)
- No photo gallery for study spots
- Users don't have access to their reviews (so no editing or deleting reviews)
- When adding a new study spot, there is no input for hours of operations
- Clicking tags doesn't filter out spots with same tags

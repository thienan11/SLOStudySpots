# App

This package implements a single-page application (SPA), built on the Model-View-Update (MVU) architecture using mu-store for state management and type safety. It utilizes Lit for rendering the DOM, reacting dynamically to changes in the model. The application structure is modular, with multiple LitElement components that pass data via slots, attributes, and reactive properties. Client-side routing is managed through mu-switch, allowing URL-dependent view rendering. The system's behavior contains a series of custom Msgs, extending the update function to handle application-specific logic.

## Running

### Development

Make sure to have all dependencies installed before running.

For development, run the following command in the directory `packages/app`:

```shell
npm run dev
```
And in a separate terminal, navigate to `packages/server` and execute:

```shell
npm run dev
```

These commands will activate both the frontend and backend servers, setting up the full environment for development and testing.

### Production

For simplicity, we’ll have the backend serve the frontend along with the API. Run the following command in the directory `packages/app` to create a `dist/` directory with static files:

```shell
npm run build
```

Now we need to tell our backend to serve these files by running the following in `packages/server`: 

```shell
npm run start:app
```

This will enable you to serve the SPA from the server for production.

## Future Features
- Ability to favorite and view favorited spots
- Option to add hours of operation when adding a new study spot
- Filter spots with same tags when clicking on tags
- Can only one write review per spot (only able to edit or delete after that)
- Possibly make it so that a study spot can only be posted after approval by an admin.

## Fixes
- Fix back links for some view (use History?)
- Improve overall design (mainly responsive design)

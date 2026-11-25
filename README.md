# CG React App

A React application built with Vite. The currently active screen is a leave-reason text area that grows as the user types. The repository also contains employee and product management components and JSON Server API services; those screens are not currently rendered by `App.jsx`.

## Technology

- **React 19** for the UI and component state.
- **Vite** for the development server and production build.
- **React Bootstrap** and **Bootstrap 5** for UI components and styling.
- **JSON Server** for a local, file-backed REST API used by the employee and product services.
- **ESLint** for linting.

## Application architecture and flow

```text
Browser
  -> index.html (#root)
  -> src/main.jsx (loads global CSS and Bootstrap, mounts React)
  -> src/App.jsx (selects the active screen)
  -> src/components/Leave/LeaveReason.jsx (current screen)
```

For the data-backed employee and product features, the intended request flow is:

```text
Screen/components
  -> service module (src/services/)
  -> HTTP request to http://localhost:3000
  -> JSON Server
  -> db.json
```

The services turn API responses into data for React components. The product service combines product and stock records using `productId`. `ProductContext` manages product-screen state, and `ThemeContext` provides theme state to screens that use it. These data-backed screens and providers are currently not connected to the active `App.jsx` render.

## Project structure

```text
.
├── db.json                   # Local JSON Server data
├── index.html                # HTML entry point
├── package.json              # Dependencies and npm scripts
├── vite.config.js            # Vite, React, and React Compiler configuration
└── src/
    ├── main.jsx              # React entry point; imports global styles and Bootstrap
    ├── App.jsx               # Chooses the currently displayed screen
    ├── index.css             # Global styles
    ├── App.css               # App styles
    ├── components/
    │   ├── Leave/            # Active leave-reason screen
    │   ├── Employee/         # Employee UI components
    │   ├── stores/           # Product form and table
    │   ├── Product/          # Product card examples
    │   └── Table/            # Table component
    ├── context/              # Product and theme React contexts
    ├── func_comp/            # Small React hook/form examples
    └── services/             # Employee and product API clients
```

## Run the app

Install [Node.js](https://nodejs.org/) and npm, then open a terminal in the project directory.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Vite development server:

   ```bash
   npm run dev
   ```

3. Open the local URL printed by Vite in your browser (usually `http://localhost:5173`).

The current leave-reason screen is frontend-only; it does not require the JSON Server to run.

## Run the local JSON API

The employee and product services expect JSON Server at `http://localhost:3000`. To run it, use a **second terminal** in the project directory:

```bash
npm run server
```

This runs the `server` script in `package.json`, which starts JSON Server with `db.json`. The API is normally available at `http://localhost:3000`; for example, `http://localhost:3000/employees` returns the employee collection.

To try the API-backed features, both the Vite app and JSON Server need to be running. Note that `App.jsx` currently renders only the leave-reason screen, so the employee/product API is not called by the app as checked in.

## How the data store works

`db.json` is a local JSON file used as a lightweight development data store. JSON Server exposes its top-level collections as REST endpoints:

| Collection | Endpoint | Purpose |
| --- | --- | --- |
| `employees` | `/employees` | Employee records |
| `products` | `/products` | Product names and prices |
| `stocks` | `/stocks` | Quantities associated with products |

The employee service (`src/services/employeeService.js`) sends `GET`, `POST`, `PATCH`, and `DELETE` requests to `/employees`. The product service (`src/services/productService.js`) reads `/products` and `/stocks`, joins stock to a product by `productId`, and performs writes to both collections when creating, updating, or removing a product and its stock record.

JSON Server writes API changes back to `db.json`, so changes persist locally between server restarts. Keep the server running while using API-backed screens. This is a local development/demo store, not a production database; it has no database server, migrations, authentication, or transactional guarantees.

## Other commands

```bash
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

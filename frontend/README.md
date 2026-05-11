# Movie Watchlist Frontend + Cypress Suite

React + TypeScript example frontend for the ASP.NET Movie Watchlist API.

## API URL

By default the app calls:

```text
http://localhost:4058
```

You can override it with:

```bash
VITE_API_URL=http://localhost:4058 npm run dev
```

## Run frontend

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Run Cypress tests

Start the frontend first, then run:

```bash
npm run test:e2e
```

The tests use `cy.intercept()` to cover the required workflows without needing a live backend. The frontend itself is still written to consume the backend on port `4058`.

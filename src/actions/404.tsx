import { createAction } from "remix/fetch-router";

import { Document } from "../components/document.tsx";
import { routes } from "../routes.ts";

export default createAction(routes["404"], ({ render }) =>
  render(
    <Document>
      <main>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </main>
    </Document>,
    { status: 404 },
  ),
);

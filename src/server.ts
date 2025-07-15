import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from "@angular/ssr/node";
import express from "express";
import { join } from "node:path";
// 1. 👇 Import the ISRHandler class
import { ISRHandler } from "@rx-angular/isr/server";
import bootstrap from "./main.server";
import { CommonEngine } from "@angular/ssr/node";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const browserDistFolder = join(import.meta.dirname, "../browser");

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, "../browser");
  const indexHtml = join(serverDistFolder, "index.server.html");

  const commonEngine = new CommonEngine();

  // This array of query params will be allowed to be part of the cache key.
  // If undefined, all query params will be allowed. If empty array, no query params will be allowed.
  const allowedQueryParams = ["page"];

  // 2. 👇 Instantiate the ISRHandler class with the index.html file
  const isr = new ISRHandler({
    indexHtml,
    invalidateSecretToken: "MY_TOKEN", // replace with env secret key ex. process.env.REVALIDATE_SECRET_TOKEN
    enableLogging: true,
    serverDistFolder,
    browserDistFolder,
    bootstrap,
    commonEngine,
    allowedQueryParams,
  });

  server.use(express.json());
  server.post(
    "/api/invalidate",
    async (req, res) => await isr.invalidate(req, res),
  );

  server.set("view engine", "html");
  server.set("views", browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    "*.*",
    express.static(browserDistFolder, {
      maxAge: "1y",
    }),
  );

  // 3. 👇 Use the ISRHandler to handle the requests
  server.get(
    "*",
    // Serve page if it exists in cache
    async (req, res, next) => await isr.serveFromCache(req, res, next),
    // Server side render the page and add to cache if needed
    async (req, res, next) => await isr.render(req, res, next),
  );

  return server;
}
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
// app.use(
//   express.static(browserDistFolder, {
//     maxAge: "1y",
//     index: false,
//     redirect: false,
//   }),
// );

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.use((req, res, next) => {
//   angularApp
//     .handle(req)
//     .then((response) =>
//       response ? writeResponseToNodeResponse(response, res) : next(),
//     )
//     .catch(next);
// });

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env["PORT"] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

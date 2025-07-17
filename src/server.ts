import {
  AngularNodeAppEngine,
  CommonEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from "@angular/ssr/node";
import express from "express";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import bootstrap from "./main.server";
import { ISRHandler } from "@rx-angular/isr";

export function app(): express.Express {
  const server = express();

  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, "../browser");

  const indexHtml = join(serverDistFolder, "index.server.html");

  const angularApp = new AngularNodeAppEngine();
  const commonEngine = new CommonEngine();

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
  // server.use(
  //   express.static(browserDistFolder, {
  //     maxAge: "1y",
  //     index: false,
  //     redirect: false,
  //   }),
  // );

  // /**
  //  * Handle all other requests by rendering the Angular application.
  //  */

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    "/*any",
    express.static(browserDistFolder, {
      maxAge: "1y",
    }),
  );

  // 3. 👇 Use the ISRHandler to handle the requests
  server.get(
    "/*any",
    // Serve page if it exists in cache
    async (req, res, next) => await isr.serveFromCache(req, res, next),
    // Server side render the page and add to cache if needed
    async (req, res, next) => await isr.render(req, res, next),

    async (req, res, next) =>
      await angularApp
        .handle(req)
        .then((response) =>
          response ? writeResponseToNodeResponse(response, res) : next(),
        )
        .catch(next),
  );

  // server.use((req, res, next) => {
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
    server.listen(port, (error) => {
      if (error) {
        throw error;
      }

      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  }

  return server;
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app());

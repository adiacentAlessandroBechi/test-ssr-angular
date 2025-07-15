import { mergeApplicationConfig, ApplicationConfig } from "@angular/core";
import { provideServerRendering, withRoutes } from "@angular/ssr";
import { appConfig } from "./app.config";
import { serverRoutes } from "./app.routes.server";
import { provideISR } from "@rx-angular/isr";

const serverConfig: ApplicationConfig = {
  providers: [provideISR(), provideServerRendering(withRoutes(serverRoutes))],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

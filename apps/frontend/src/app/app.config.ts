import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHotToastConfig,
  provideHotToastHttpInterceptor,
} from '@ngxpert/hot-toast';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideHotToastConfig(),
    provideHotToastHttpInterceptor(),
    provideRouter(appRoutes),
  ],
};

import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // o provideNoopAnimations()
import { routes } from './app.routes';

// registrar datos de locale (se ejecuta en server y browser)
import '@angular/common/locales/global/es-CO';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()               // habilita fetch para SSR/dev server
    ),
    provideAnimations(),    // si instalaste @angular/animations puedes usar provideAnimations(), sino usa provideNoopAnimations()
    { provide: LOCALE_ID, useValue: 'es-CO' } // default locale
  ]
};

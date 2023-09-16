import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { APP_PROVIDER } from '@core/constants';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: APP_PROVIDER.BASE_URL, useFactory: getBaseUrl, deps: [] },
  { provide: APP_PROVIDER.BACKEND_URL, useValue: environment.BackendUrl },
  { provide: APP_PROVIDER.CLIENT_ID, useValue: environment.ClientID },
  { provide: APP_PROVIDER.CLIENT_SECRETS, useValue: environment.ClientSecrets },
];

platformBrowserDynamic(providers)
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

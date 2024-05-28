import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import routeConfig from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { EstateService } from './app/estate.service';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';


bootstrapApplication(AppComponent,
  {
    providers: [
      provideProtractorTestingSupport(),
      provideRouter(routeConfig),
      provideAnimations(),
      provideHttpClient(),
      { 
        provide: EstateService,
      },
      {
        provide: MAT_CHIPS_DEFAULT_OPTIONS,
        useValue: {
          separatorKeyCodes: [',', ' ']
        }
      },
    ]
  }
).catch(err => console.error(err));


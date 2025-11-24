// src/main.ts
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import './app/firebase.config';

bootstrapApplication(AppComponent, appConfig).catch(console.error);

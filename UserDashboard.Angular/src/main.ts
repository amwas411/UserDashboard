import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { Routes, provideRouter } from '@angular/router';
import { UserDashboardComponent } from './app/user-dashboard/user-dashboard.component';
import { WeatherComponent } from './app/weather/weather.component';

const routes: Routes = [
	{path: "dashboard", component: UserDashboardComponent},
	{path: "weather", component: WeatherComponent}
];

bootstrapApplication(AppComponent, {
	providers: [provideRouter(routes)]
}).catch((err) => console.error(err));

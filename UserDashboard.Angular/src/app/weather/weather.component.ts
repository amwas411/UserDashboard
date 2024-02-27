import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { CurrentWeatherData } from '../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
	/**
	 * Данные о погоде.
	 */
	weatherData: Promise<CurrentWeatherData[]>;

	/**
	 * Конструктор.
	 * @param _weatherService Сервис погоды.
	 */
	constructor(private _weatherService: WeatherService) {
		this.weatherData = this._weatherService.getWeather();
	}

}

import { Injectable } from '@angular/core';
import { CurrentWeatherData } from './interfaces';
import { environment } from '../environments/environment';

/**
 * Сервис погоды.
 */
@Injectable({
	providedIn: 'root'
})
export class WeatherService {
	constructor() {}

	// Ресурс.
	private _resource = "getWeather";
	// Хост.
	private _host = environment.production ? document.location.origin : environment.host;
	// Метрика.
	private _units = "metric";
	// Язык.
	private _lang = "ru";
	// Кэш.
	private _cache?: CurrentWeatherData[];
	// Дата последнего обращения к сервису погоды.
	private _lastCallTime?: number;
	// Кэш геолокации.
	private _position?: GeolocationPosition;
	// Порог в минутах для обращения к сервису погоды.
	private _minutesThreshold = 10;
	// Коэффициент для перевода из гПа в мм рт.ст.
	private _hPaToMercuryFactor = 0.75;

	/**
	 * Актуальность кэша.
	 * @returns true, если кэш актуален.
	 */
	private isCacheActual(): boolean {
		return this._lastCallTime != undefined && new Date(Date.now() - this._lastCallTime).getMinutes() < this._minutesThreshold;
	}

	/**
	 * Получить параметры для обращения к сервису погоды.
	 * @param lat Широта.
	 * @param lon Долготы.
	 * @returns Строка для передачи в GET-запрос.
	 */
	private getQueryParameters(lat: number, lon: number): string {
		return `lang=${this._lang}&units=${this._units}&lat=${lat}&lon=${lon}`;
	}

	/**
	 * Получить данные о погоде.
	 * @param latitude Широта.
	 * @param longitude Долгота.
	 * @returns Данные о погоде.
	 */
	private async getWeatherData(latitude: number, longitude: number): Promise<CurrentWeatherData[]> {
		this._lastCallTime = Date.now();
		let response = await fetch(`${this._host}/${this._resource}?${this.getQueryParameters(latitude, longitude)}`);
		if (!response.ok) {
			throw new Error("Fetch failed.");
		}
		
		let data = JSON.parse(await response.json());

		// Перевод в мм рт.ст.
		data.main.pressure *= this._hPaToMercuryFactor;
		this._cache = [data];
		return this._cache;
	}

	/**
	 * Получить данные о погоде.
	 * @returns Данные о погоде.
	 */
	async getWeather(): Promise<CurrentWeatherData[]> {
		if (!environment.production) {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve([environment.weatherMock!]);
				}, 500);
			});
		}

		if (this._cache && this.isCacheActual()) {
			return this._cache;
		}

		if (this._position) {
			return this.getWeatherData(this._position.coords.latitude, this._position.coords.longitude);
		}

		return await new Promise(resolve => {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					this._position = position;
					resolve(this.getWeatherData(position.coords.latitude, position.coords.longitude));
				}, 
				(positionError) => console.error(positionError.message),
				{enableHighAccuracy: true});
		});
	}
}
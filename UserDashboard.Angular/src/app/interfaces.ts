/**
 * Колонка.
 */
export interface Column {
	name: string,
	type: number,
	caption: string
};

/**
 * Объект.
 */
export interface Entity {
	id?: string,
	createdon?: Date,
	modifiedon?: Date,
};

/**
 * Контакт.
 */
export interface Contact extends Entity {
	name?: string,
};

/**
 * Пользователь.
 */
export interface SysAdminUnit extends Entity {
	name?: string | null,
	userPassword?: string | null,
	active?: boolean,
	contact?: Contact | null,
};

/**
 * Конфигурация диалога пользователя.
 */
export interface UserDialogConfig {
	mode: number;
	defaultValues?: Map<string, boolean>
}

/**
 * Данные о погоде.
 */
export interface CurrentWeatherData {
	coord: {
		lon: number,
		lat: number,
	},
	weather: {
		id: number,
		main: string,
		description: string,
		icon: string,
	}[],
	base: string,
	main: {
		temp: number,
		feels_like: number,
		temp_min: number,
		temp_max: number,
		pressure: number,
		humidity: number,
		sea_level: number,
		grnd_level: number,
	}
	visibility: number,
	wind: {
		speed: number,
		deg: number,
		gust: number,
	}
	clouds: {
		all: number,
	}
	dt: number,
	sys: {
		country: string,
		sunrise: number,
		sunset: number,
	}
	timezone: number,
	id: number,
	name: string,
	cod: number,
}

/**
 * Окружение.
 */
export interface Environment {
	production: boolean,
	weatherMock?: CurrentWeatherData,
	host?: string,
}
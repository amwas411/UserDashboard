import { Environment } from '../app/interfaces'

export const environment: Environment = {
	production: false,
	host: "http://localhost:6971",
	weatherMock: {
		"coord": {
			"lon": 58,
			"lat": 58
		},
		"weather": [
			{
				"id": 804,
				"main": "Clouds",
				"description": "пасмурно",
				"icon": "04d"
			}
		],
		"base": "stations",
		"main": {
			"temp": -12.09,
			"feels_like": -18.05,
			"temp_min": -12.09,
			"temp_max": -12.09,
			"pressure": 1034,
			"humidity": 92,
			"sea_level": 1034,
			"grnd_level": 991
		},
		"visibility": 1688,
		"wind": {
			"speed": 3.02,
			"deg": 234,
			"gust": 4.61
		},
		"clouds": {
			"all": 100
		},
		"dt": 1708593971,
		"sys": {
			"country": "RU",
			"sunrise": 1708572231,
			"sunset": 1708607981
		},
		"timezone": 18000,
		"id": 532675,
		"name": "Лысьва",
		"cod": 200
	},
};

using Microsoft.EntityFrameworkCore;
using UserDashboard.Repository;
using UserDashboard.Repository.Models;

const string ANY_ORIGIN_CORS = "anyOriginCors";
const string OPEN_WEATHER_URI = "https://api.openweathermap.org/data/2.5/weather";

var builder = WebApplication.CreateBuilder(args);

var openWeatherApiKey = builder.Configuration.GetValue<string>("OpenWeatherApiKey");
var connectionString = builder.Configuration.GetConnectionString("db");

builder.Services.AddCors(options =>
	options.AddPolicy(ANY_ORIGIN_CORS, policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddDbContext<BpmsoftDbContext>(options => options
	.EnableDetailedErrors()
	.UseSqlServer(connectionString)
);

var app = builder.Build();

app.MapPost("/users", (SysAdminUnitModel sysAdminUnitModel) => Create(sysAdminUnitModel));
app.MapGet("/users", (int? rows, string? name) => Read(rows, name));
app.MapPatch("/users", (Guid id, SysAdminUnitModel sysAdminUnitModel) => Update(id, sysAdminUnitModel));
app.MapDelete("/users", (Guid id) => Delete(id));

app.MapGet("/getWeather", (float lat, float lon, string? lang, string? units) => GetWeather(lat, lon, lang, units));

app.UseFileServer();
app.UseCors(ANY_ORIGIN_CORS);
app.Run();

/// <summary>
/// Создание.
/// </summary>
/// <param name="sysAdminUnitModel">Модель пользователя.</param>
/// <returns>Результат.</returns>
IResult Create(SysAdminUnitModel sysAdminUnitModel)
{
	using var scope = app.Services.CreateScope();
	var manager = scope.ServiceProvider.GetRequiredService<IUserRepository>();
	return Results.Created(string.Empty, manager.Create(sysAdminUnitModel));
}

/// <summary>
/// Чтение.
/// </summary>
/// <param name="rowCount">Количество записей.</param>
/// <param name="name">Фильтрация по имени пользователя.</param>
/// <returns>Результат.</returns>
async Task<IResult> Read(int? rowCount, string? name)
{
	var defaultCount = 15;
	using var scope = app.Services.CreateScope();
	var manager = scope.ServiceProvider.GetRequiredService<IUserRepository>();
	var result = await manager.ReadAsync(rowCount ?? defaultCount, name);
	return Results.Ok(result);
}

/// <summary>
/// Обновление.
/// </summary>
/// <param name="sysAdminUnitModel">Модель пользователя.</param>
/// <returns>Результат.</returns>
IResult Update(Guid id, SysAdminUnitModel sysAdminUnitModel)
{
	sysAdminUnitModel.Id = id;
	using var scope = app.Services.CreateScope();
	var manager = scope.ServiceProvider.GetRequiredService<IUserRepository>();
	return manager.Update(sysAdminUnitModel) > 0
		? Results.Ok()
		: Results.Accepted();
}

/// <summary>
/// Удаление.
/// </summary>
/// <param name="sysAdminUnitId">Идентификатор пользователя.</param>
/// <returns>Результат.</returns>
IResult Delete(Guid sysAdminUnitId)
{
	using var scope = app.Services.CreateScope();
	var manager = scope.ServiceProvider.GetRequiredService<IUserRepository>();
	return manager.Delete(sysAdminUnitId) > 0
		? Results.Ok()
		: Results.Accepted();
}

/// <summary>
/// Получить данные о погоде.
/// </summary>
/// <param name="latitude">Широта.</param>
/// <param name="longtitude">Долгота.</param>
/// <param name="language">Язык.</param>
/// <param name="units">Метрика.</param>
/// <returns>Результат.</returns>
async Task<IResult> GetWeather(float latitude, float longtitude, string? language, string? units)
{
	string GetQueryParameters() {
		if (string.IsNullOrEmpty(openWeatherApiKey)) 
		{
			throw new NullReferenceException($"{nameof(openWeatherApiKey)} was not set.");
		}
		var parameters = $"lat={latitude}&lon={longtitude}&appid={openWeatherApiKey}";

		if (!string.IsNullOrEmpty(language)) 
		{
			parameters += $"&lang={language}";
		}
		if (!string.IsNullOrEmpty(units)) 
		{
			parameters += $"&units={units}";
		}

		return parameters;
	}

	var url = $"{OPEN_WEATHER_URI}?{GetQueryParameters()}";

	using var httpClient = new HttpClient();
	var response = await httpClient.GetAsync(url);
	response.EnsureSuccessStatusCode();

	var content = await response.Content.ReadAsStringAsync();

	return Results.Ok(content);
}
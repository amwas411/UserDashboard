namespace UserDashboard.Repository.Models;

/// <summary>
/// Модель пользователя (DTO).
/// </summary>
public class SysAdminUnitModel : Entity
{
	/// <summary>
	/// Имя.
	/// </summary>
	public string? Name { get; set; }
	
	/// <summary>
	/// Пароль.
	/// </summary>
	public string? UserPassword { get; set; }

	/// <summary>
	/// Активен.
	/// </summary>
	public bool? Active { get; set; }

	/// <summary>
	/// Сонтакт.
	/// </summary>
	public Contact? Contact { get; set; }
}
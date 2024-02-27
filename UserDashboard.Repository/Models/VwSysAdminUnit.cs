namespace UserDashboard.Repository.Models;

/// <summary>
/// Пользователь.
/// </summary>
public class VwSysAdminUnit : Entity
{
	/// <summary>
	/// Имя.
	/// </summary>
	public string Name { get; set; } = string.Empty;
	
	/// <summary>
	/// Пароль.
	/// </summary>
	public string UserPassword { get; set; } = string.Empty;

	/// <summary>
	/// Активен.
	/// </summary>
	public bool Active { get; set; }

	/// <summary>
	/// Контакт.
	/// </summary>
	public Contact? Contact { get; set; }

	/// <summary>
	/// Культура.
	/// </summary>
	public Guid? SysCultureId { get; set; }

	#region Обязательные колонки для создания сущности в БД.
	public int SessionTimeout { get; set; }
	public int ConnectionType { get; set; }
	public int ProcessListeners { get; set; }
	public bool IsDirectoryEntry { get; set; }
	public bool ForceChangePassword { get; set; }
	public bool LoggedIn { get; set; }
	public bool SynchronizeWithLDAP { get; set; }
	public string Email { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
	public Guid SysAdminUnitTypeId { get; set; } = Constants.SysAdminUnitType.User;
	#endregion Обязательные колонки для создания сущности в БД.
}

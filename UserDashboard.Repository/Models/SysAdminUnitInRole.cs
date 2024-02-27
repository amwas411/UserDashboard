namespace UserDashboard.Repository.Models;

/// <summary>
/// Роль пользователя.
/// </summary>
public class SysAdminUnitInRole : Entity
{
	/// <summary>
	/// Источник.
	/// </summary>
	public AdminUnitRoleSources Source { get; set; }

	/// <summary>
	/// Роль.
	/// </summary>
	public Guid SysAdminUnitRoleId { get; set; }

	/// <summary>
	/// Пользователь.
	/// </summary>
	public Guid SysAdminUnitId { get; set; }
}
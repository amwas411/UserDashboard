namespace UserDashboard.Repository.Models;

/// <summary>
/// Вхождение пользователя в роль.
/// </summary>
public class SysUserInRole : Entity
{
	/// <summary>
	/// Роль.
	/// </summary>
	public Guid SysRoleId { get; set; }

	/// <summary>
	/// Пользователь.
	/// </summary>
	public Guid SysUserId { get; set; }
}
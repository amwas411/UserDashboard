using Microsoft.EntityFrameworkCore;

namespace UserDashboard.Repository.Models;

/// <summary>
/// Контекст БД.
/// </summary>
public class BpmsoftDbContext: DbContext
{
	/// <summary>
	/// Пользователь.
	/// </summary>
	public DbSet<VwSysAdminUnit> VwSysAdminUnit { get; set; }

	/// <summary>
	/// Роль пользователя.
	/// </summary>
	public DbSet<SysAdminUnitInRole> SysAdminUnitInRole { get; set; }

	/// <summary>
	/// Вхождение пользователя в роль.
	/// </summary>
	public DbSet<SysUserInRole> SysUserInRole { get; set; }

	/// <summary>
	/// Контакт.
	/// </summary>
	public DbSet<Contact> Contact { get; set; }

	/// <summary>
	/// Конструктор.
	/// </summary>
	/// <param name="options">Настройки контекста.</param>
	public BpmsoftDbContext(DbContextOptions options) : base(options) {}

	/// <summary>
	/// Конфигурация контекста.
	/// </summary>
	/// <param name="modelBuilder">API для конфигурации контекста.</param>
	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<VwSysAdminUnit>()
			.ToTable(tb => tb.HasTrigger("T"));
		modelBuilder.Entity<Contact>()
			.ToTable(tb => tb.HasTrigger("T"));
	}
}
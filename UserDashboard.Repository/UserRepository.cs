using Microsoft.EntityFrameworkCore;
using UserDashboard.Repository.Models;

namespace UserDashboard.Repository;

/// <summary>
/// Репозиторий пользователей.
/// </summary>
/// <param name="dbContext">Контекст БД.</param>
public class UserRepository(BpmsoftDbContext dbContext) : IDisposable, IUserRepository
{
	/// <summary>
	/// Контекст БД.
	/// </summary>
	protected BpmsoftDbContext Context { get; set; } = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

	/// <summary>
	/// Удаление ресурсов контекста БД.
	/// </summary>
	public void Dispose()
	{
		Context.Dispose();
	}

	/// <summary>
	/// Создать пользователя.
	/// </summary>
	/// <param name="sysAdminUnitModel">Модель пользователя.</param>
	/// <returns>Количество изменённых записей.</returns>
	/// <exception cref="NullReferenceException"></exception>
	public virtual SysAdminUnitModel Create(SysAdminUnitModel sysAdminUnitModel)
	{
		ArgumentNullException.ThrowIfNull(sysAdminUnitModel);
		if (string.IsNullOrEmpty(sysAdminUnitModel.Name))
		{
			throw new NullReferenceException($"{nameof(sysAdminUnitModel)} has empty property \"Name\"");
		}
		if (string.IsNullOrEmpty(sysAdminUnitModel.UserPassword))
		{
			throw new NullReferenceException($"{nameof(sysAdminUnitModel)} has empty property \"UserPassword\"");
		}

		var createdOn = DateTime.UtcNow;

		sysAdminUnitModel.UserPassword = BPMSoft.Common.PasswordCryptoProvider.GetHashByPassword(sysAdminUnitModel.UserPassword);
		if (sysAdminUnitModel.Id == default)
		{
			sysAdminUnitModel.Id = Guid.NewGuid();
		}
		if (sysAdminUnitModel.Contact == default)
		{
			sysAdminUnitModel.Contact = new Contact()
			{
				Name = sysAdminUnitModel.Name
			};
		}
		sysAdminUnitModel.Contact.CreatedOn = createdOn;
		sysAdminUnitModel.Contact.ModifiedOn = createdOn;
		sysAdminUnitModel.CreatedOn = createdOn;
		sysAdminUnitModel.ModifiedOn = createdOn;

		var sysAdminUnit = new VwSysAdminUnit();
		Context.Add(sysAdminUnit).CurrentValues.SetValues(sysAdminUnitModel);
		sysAdminUnit.Contact = sysAdminUnitModel.Contact;
		sysAdminUnit.SysCultureId = Constants.SysCulture.Ru;
		sysAdminUnit.CreatedOn = sysAdminUnitModel.CreatedOn;
		sysAdminUnit.ModifiedOn = sysAdminUnitModel.ModifiedOn;

		Context.SaveChanges();
		createdOn = DateTime.UtcNow;
		Context.Add(new SysUserInRole()
		{
			SysUserId = sysAdminUnit.Id,
			SysRoleId = Constants.SysRole.AllEmployees,
			CreatedOn = createdOn,
			ModifiedOn = createdOn
		});
		Context.AddRange(new SysAdminUnitInRole()
		{
			SysAdminUnitId = sysAdminUnit.Id,
			SysAdminUnitRoleId = Constants.SysRole.AllEmployees,
			Source = AdminUnitRoleSources.ExplicitEntry | AdminUnitRoleSources.UpHierarchy,
			CreatedOn = createdOn,
			ModifiedOn = createdOn
		}, new SysAdminUnitInRole()
		{
			SysAdminUnitId = sysAdminUnit.Id,
			SysAdminUnitRoleId = sysAdminUnit.Id,
			Source = AdminUnitRoleSources.Self,
			CreatedOn = createdOn,
			ModifiedOn = createdOn
		});
		Context.SaveChanges();

		sysAdminUnitModel.UserPassword = null;
		return sysAdminUnitModel;
	}

	/// <summary>
	/// Чтение.
	/// </summary>
	/// <param name="rowCount">Количество записей.</param>
	/// <param name="name">Фильтрация по имени пользователя.</param>
	/// <returns>Пользователи.</returns>
	public virtual List<SysAdminUnitModel> Read(int rowCount, string? name = null)
	{
		if (rowCount < 1)
		{
			rowCount = 15;
		}

		var query = string.IsNullOrEmpty(name)
			? 	(from u in Context.VwSysAdminUnit 
				select new 
				{
				 	u.Id, u.Name, u.Active,
					u.Contact, u.CreatedOn, u.ModifiedOn
				}).Take(rowCount)
			: 	(from u in Context.VwSysAdminUnit 
				where u.Name.Contains(name)
				select new 
				{
					u.Id, u.Name, u.Active,
					u.Contact, u.CreatedOn, u.ModifiedOn
				}).Take(rowCount);

		return [.. query.Select(item => new SysAdminUnitModel()
			{
				Id = item.Id,
				Name = item.Name,
				Active = item.Active,
				Contact = item.Contact,
				CreatedOn = item.CreatedOn,
				ModifiedOn = item.ModifiedOn,
			})];
	}

	/// <summary>
	/// Обновление
	/// </summary>
	/// <param name="sysAdminUnitModel">Модель пользователя.</param>
	/// <returns>Количество изменённых записей.</returns>
	/// <exception cref="ArgumentException"></exception>
	public virtual int Update(SysAdminUnitModel sysAdminUnitModel)
	{
		ArgumentNullException.ThrowIfNull(sysAdminUnitModel);
		if (sysAdminUnitModel.Id == default)
		{
			throw new ArgumentException($"{nameof(sysAdminUnitModel)} has empty property \"Id\".");
		}

		var entity = Context.VwSysAdminUnit.Include(u => u.Contact).FirstOrDefault(u => u.Id == sysAdminUnitModel.Id);

		if (entity == default)
		{
			return 0;
		}

		var modifiedOn = DateTime.UtcNow;
		if (!string.IsNullOrEmpty(sysAdminUnitModel.Name))
		{
			entity.Name = sysAdminUnitModel.Name;
		}
		if (!string.IsNullOrEmpty(sysAdminUnitModel.UserPassword))
		{
			entity.UserPassword = BPMSoft.Common.PasswordCryptoProvider.GetHashByPassword(sysAdminUnitModel.UserPassword);
		}
		if (sysAdminUnitModel.Active.HasValue)
		{
			entity.Active = sysAdminUnitModel.Active.Value;
		}
		if (!string.IsNullOrEmpty(sysAdminUnitModel.Contact?.Name))
		{
			if (entity.Contact != default)
			{
				var contact = Context.Contact.First(c => c.Id == entity.Contact.Id);
				contact.Name = sysAdminUnitModel.Contact.Name;
				contact.ModifiedOn = modifiedOn;
			}
			else 
			{
				entity.Contact = new Contact()
				{
					CreatedOn = modifiedOn,
					ModifiedOn = modifiedOn,
					Name = sysAdminUnitModel.Contact.Name
				};
				Context.Add(entity.Contact);
			}
		}

		if (Context.Entry(entity).State == EntityState.Modified)
		{
			entity.ModifiedOn = DateTime.UtcNow;
		}

		return Context.SaveChanges();
	}

	/// <summary>
	/// Удаление.
	/// </summary>
	/// <param name="sysAdminUnitId">Идентификатор пользователя.</param>
	/// <returns>Количество изменённых записей.</returns>
	/// <exception cref="ArgumentException"></exception>
	public virtual int Delete(Guid sysAdminUnitId)
	{
		if (sysAdminUnitId == default) 
		{
			throw new ArgumentException($"{nameof(sysAdminUnitId)} is empty.");
		}

		var entity = Context.VwSysAdminUnit.Find(sysAdminUnitId);
		if (entity == null)
		{
			return 0;
		}

		Context.Remove(entity);

		return Context.SaveChanges();
	}

	/// <summary>
	/// Асинхронное чтение.
	/// </summary>
	/// <param name="rowCount"></param>
	/// <param name="name"></param>
	/// <returns></returns>
	public Task<List<SysAdminUnitModel>> ReadAsync(int rowCount, string? name)
	{
		return Task.FromResult(Read(rowCount, name));
	}
}
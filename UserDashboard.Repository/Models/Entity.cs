using System.Reflection;
using System.Text;

namespace UserDashboard.Repository.Models;

/// <summary>
/// Объект.
/// </summary>
public abstract class Entity
{
	/// <summary>
	/// Идентификатор.
	/// </summary>
	public Guid Id { get; set; }

	/// <summary>
	/// Дата создания.
	/// </summary>
	public DateTime? CreatedOn { get; set; }

	/// <summary>
	/// Дата изменения.
	/// </summary>
	public DateTime? ModifiedOn { get; set; }

	/// <summary>
	/// Публичные свойства объекта.
	/// </summary>
	protected PropertyInfo[] Properties => _properties ??= GetType().GetProperties();
	private PropertyInfo[]? _properties;

	/// <summary>
	/// Приведение к строковому виду.
	/// </summary>
	/// <returns>Строковое представление объекта.</returns>
	public override string ToString()
	{
		var sb = new StringBuilder();
		foreach (var property in Properties.Select(property => property.Name))
		{
			sb.AppendFormat("{0}\t{1}\n", property, Properties.First(i => i.Name == property).GetValue(this));
		}
		return sb.ToString();
	}
}

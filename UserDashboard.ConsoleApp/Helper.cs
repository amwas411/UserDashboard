namespace UserDashboard.ConsoleApp
{
	public class Helper
	{
		/// <summary>
		/// Заполнить свойство объекта.
		/// </summary>
		/// <typeparam name="T">Тип объекта.</typeparam>
		/// <param name="entity">Объект.</param>
		/// <param name="propertyName">Свойство.</param>
		/// <param name="propertyValue">Значение.</param>
		/// <exception cref="NullReferenceException"></exception>
		public static void SetTypedValue<T>(T entity, string propertyName, string propertyValue)
		{
			ArgumentNullException.ThrowIfNull(entity);
			ArgumentNullException.ThrowIfNull(propertyName);
			ArgumentException.ThrowIfNullOrWhiteSpace(propertyValue);

			var property = typeof(T).GetProperty(propertyName) ??
				throw new NullReferenceException($"{propertyName} not found in {typeof(T).Name}");

			var propertyType = property.PropertyType;
			if (propertyType == typeof(bool))
			{
				property.SetValue(entity, Convert.ChangeType(propertyValue, typeof(bool)));
			}
			else if (propertyType == typeof(Guid))
			{
				property.SetValue(entity, Guid.Parse(propertyValue));
			}
			else if (propertyType == typeof(Guid) && propertyValue != null)
			{
				property.SetValue(entity, DateTime.Parse(propertyValue));
			}
			else if (propertyType == typeof(int))
			{
				property.SetValue(entity, Convert.ToInt32(propertyValue));
			}
			else if (propertyType == typeof(decimal) || propertyType == typeof(double))
			{
				property.SetValue(entity, Convert.ToDouble(propertyValue));
			}
			else
			{
				property.SetValue(entity, propertyValue);
			}
		}
	}
}
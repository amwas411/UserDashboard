namespace UserDashboard.Repository;

/// <summary>
/// Константы.
/// </summary>
public static class Constants
{
	/// <summary>
	/// Культура.
	/// </summary>
	public static class SysCulture
	{
		public static Guid Ru => new("1a778e3f-0a8e-e111-84a3-00155d054c03");
		public static Guid En => new("a5420246-0a8e-e111-84a3-00155d054c03");
	}

	/// <summary>
	/// Роль.
	/// </summary>
	public static class SysRole
	{
		public static Guid AllEmployees => new("A29A3BA5-4B0D-DE11-9A51-005056C00008");
	}

	/// <summary>
	/// Тип пользователя.
	/// </summary>
	public static class SysAdminUnitType
	{
		public static Guid User => new("472e97c7-6bd7-df11-9b2a-001d60e938c6");
		public static Guid PortalUser => new("f4044c41-df2b-e111-851e-00155d04c01d");
		public static Guid Manager => new("b759f1c0-6bd7-df11-9b2a-001d60e938c6");
		public static Guid Division => new("b659f1c0-6bd7-df11-9b2a-001d60e938c6");
		public static Guid Organization => new("df93dcb9-6bd7-df11-9b2a-001d60e938c6");
		public static Guid Team => new("462e97c7-6bd7-df11-9b2a-001d60e938c6");
		public static Guid FunctionalRole => new("625aca96-0293-4ab4-b7b1-37c9a6a42fed");
	}

	/// <summary>
	/// Тип соединения.
	/// </summary>
	public static class ConnectionType
	{
		public static Guid Virtual => new("e96a0adf-3e4f-47f9-81c3-e8628eab55f0");
		public static Guid Employee => new("df8ff7a2-c9bf-4f28-80b1-ed16fa77818d");
		public static Guid PortalUser => new("4ad0e44a-6502-4499-984c-f626d12c6301");
	}
}

/// <summary>
/// Источники.
/// </summary>
[Flags]
public enum AdminUnitRoleSources
{
	None = 0,
	Self = 1,
	ExplicitEntry = 2,
	Delegated = 4,
	FuncRoleFromOrgRole = 8,
	UpHierarchy = 16,
	AsManager = 32,
	All = 63
}
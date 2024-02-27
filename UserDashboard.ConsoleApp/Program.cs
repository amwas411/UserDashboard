using Microsoft.EntityFrameworkCore;
using UserDashboard.ConsoleApp;
using UserDashboard.Repository;
using UserDashboard.Repository.Models;

SysAdminUnitModel? lastSelectedUser = null;

do
{
	try
	{
		Console.WriteLine("C/R/U/D");

		var k = Console.ReadKey().Key;
		var prompt = "";
		var value = "";
		var column = "";
		string[] parts;

		var dbContextOptions = new DbContextOptionsBuilder<BpmsoftDbContext>()
			.EnableDetailedErrors()
			.UseSqlServer(System.Configuration.ConfigurationManager.ConnectionStrings["db"].ConnectionString)
			.Options;

		switch (k)
		{
			case ConsoleKey.C:
				Console.WriteLine("Create: Column1:Value1 [...ColumnN:ValueN]");
				prompt = Console.ReadLine();
				if (string.IsNullOrWhiteSpace(prompt))
				{
					Console.WriteLine($"Prompt length must be in range [1:N], but got null");
					continue;
				}
				parts = prompt.Split(' ');
				if (parts.Length < 1)
				{
					Console.WriteLine($"Prompt length must be in range [1;N], but got {parts.Length}");
					continue;
				}

				var unit = new SysAdminUnitModel();

				foreach (var pair in parts)
				{
					var p1 = pair.Split(':');
					value = p1[1];
					column = p1[0];
					var property = unit.GetType().GetProperty(column) ??
						throw new Exception($"Property {column} is not found");
					
					Helper.SetTypedValue(unit, column, value);
				}

				using (var manager = new UserRepository(new BpmsoftDbContext(dbContextOptions)))
				{
					Console.WriteLine("Rows affected: " + manager.Create(unit));
				}
				lastSelectedUser = unit;
				break;

			case ConsoleKey.R:
				Console.WriteLine("Read: RowCount [Name]");
				prompt = Console.ReadLine();
				var rowCount = 0;
				var name = string.Empty;

				if (!string.IsNullOrWhiteSpace(prompt))
				{
					parts = prompt.Split(' ');
					rowCount = Convert.ToInt32(parts[0]);
					if (parts.Count() > 1) {
						name = parts[1];
					}
				}

				using (var manager = new UserRepository(new BpmsoftDbContext(dbContextOptions)))
				{
					var sysAdminUnits = manager.Read(rowCount, name);
					foreach (var item in sysAdminUnits)
					{
						Console.WriteLine(item);
					}
					lastSelectedUser = sysAdminUnits.LastOrDefault();
				}
				break;

			case ConsoleKey.U:
				Console.WriteLine("Update: Column1:Value1 [...ColumnN:ValueN]");
				prompt = Console.ReadLine();

				if (string.IsNullOrWhiteSpace(prompt))
				{
					Console.WriteLine($"Prompt length must be in range [1;N], but got null");
					continue;
				}

				parts = prompt.Split(' ');
				if (parts.Length < 1) { Console.WriteLine("Prompt length must be in range [1;N]"); }
				foreach (var pair in parts)
				{
					var a = pair.Split(':');
					column = a[0];
					value = a[1];
					Helper.SetTypedValue(lastSelectedUser, column, value);
				}

				using (var manager = new UserRepository(new BpmsoftDbContext(dbContextOptions)))
				{
					if (lastSelectedUser == default) 
					{
						throw new NullReferenceException(nameof(lastSelectedUser));
					}
					Console.WriteLine("Rows affected: " + manager.Update(lastSelectedUser));
				}
				break;

			case ConsoleKey.D:
				Console.WriteLine("Delete");
				var deleteUserModel = new SysAdminUnitModel() {
					Id = lastSelectedUser?.Id ?? Guid.Empty
				};
				using (var manager = new UserRepository(new BpmsoftDbContext(dbContextOptions)))
				{
					Console.WriteLine("Rows affected: " + manager.Delete(deleteUserModel.Id));
				}
				lastSelectedUser = null;
				break;

			default:
				throw new NotImplementedException($"Unknown key-command {k}");
		}
	}
	catch (Exception e)
	{
		Console.WriteLine(e);
	}
} while (true);
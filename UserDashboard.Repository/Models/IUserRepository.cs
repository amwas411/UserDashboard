using UserDashboard.Repository.Models;

public interface IUserRepository
{
	SysAdminUnitModel Create(SysAdminUnitModel dto);
	List<SysAdminUnitModel> Read(int rowCount, string? name);
	Task<List<SysAdminUnitModel>> ReadAsync(int rowCount, string? name);
	int Update(SysAdminUnitModel dto);
	int Delete(Guid id);
}
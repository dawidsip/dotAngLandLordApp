using Microsoft.EntityFrameworkCore;
using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Interfaces;
public interface ILLDataContext
{
    // DbSet<User> Users { get;  }
    DbSet<Estate> Estates { get; }
    DbSet<Facility> Facilities { get; }

    public Task<List<Estate>> GetEstatesByUserIdAsync(string userId);

    public Task<Estate> GetEstateByIdAsync(int id);

    public Task<List<Facility>> GetBasicFacilities();
    // Other members if needed
    public Task<int> SaveChangesAsync();
}

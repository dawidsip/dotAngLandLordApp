using Microsoft.EntityFrameworkCore;
using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Interfaces;
public interface ILLDataContext
{
    // DbSet<User> Users { get;  }
    DbSet<Estate> Estates { get; }

    public Task<List<Estate>> GetEstatesByUserIdAsync(string userId);

    public Task<Estate> GetEstateByIdAsync(int id);
    // Other members if needed
    public int SaveChanges();
}

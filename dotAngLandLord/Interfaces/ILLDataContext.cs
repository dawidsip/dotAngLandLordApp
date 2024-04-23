using Microsoft.EntityFrameworkCore;
using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Interfaces;
public interface ILLDataContext
{
    DbSet<User> Users { get;  }
    DbSet<Estate> Estates { get; }

    public Task<List<Estate>> GetEstatesByUserIdAsync(int userId);
    // Other members if needed
    public int SaveChanges();
}

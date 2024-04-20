using Microsoft.EntityFrameworkCore;
using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Interfaces;
public interface ILLDataContext
{
    DbSet<User> Users { get;  }
    DbSet<Estate> Estates { get; }

    // Other members if needed
    public int SaveChanges();
}

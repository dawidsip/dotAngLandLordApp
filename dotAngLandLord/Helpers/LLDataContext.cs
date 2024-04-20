using Microsoft.EntityFrameworkCore;
using dotAngLandLord.Interfaces;

using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Helpers;

public class LLDataContext : DbContext, ILLDataContext
{
    public LLDataContext(DbContextOptions<LLDataContext> options)
        : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure table name
        modelBuilder.Entity<User>().ToTable("User"); // Singular table name
        modelBuilder.Entity<Estate>().ToTable("Estate"); // Singular table name
    }
    public DbSet<User> Users { get; set; }

    public DbSet<Estate> Estates { get; set; }
}
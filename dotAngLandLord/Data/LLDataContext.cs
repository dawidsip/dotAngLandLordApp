using Microsoft.EntityFrameworkCore;
using dotAngLandLord.Interfaces;
using dotAngLandLord.DomainObjects;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace dotAngLandLord.Data;

public class LLDataContext : IdentityDbContext, ILLDataContext
{
    public LLDataContext(DbContextOptions<LLDataContext> options)
        : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // Ensure base class configurations are applied
        // Configure table name
        // modelBuilder.Entity<User>().ToTable("User"); // Singular table name
        modelBuilder.Entity<Estate>().ToTable("Estate"); // Singular table name
        modelBuilder.Entity<Image>().ToTable("Image");

        modelBuilder.Entity<Estate>()
            .HasMany(estate => estate.Images)
            .WithOne()
            .HasForeignKey(i => i.EstateId)
            .OnDelete(DeleteBehavior.Cascade);

        // modelBuilder.Entity<Image>()
        //     .HasOne(i => i.Estate)
        //     .WithMany(e => e.Images)
        //     .HasForeignKey(i => i.EstateId);
            
    }
    // public DbSet<User> Users { get; set; }

    public DbSet<Estate> Estates { get; set; }
    public DbSet<Image> Images { get; set; }


    public async Task<List<Estate>> GetEstatesByUserIdAsync(string userId)
    {
        return await Estates
            .Where(e => e.UserId == userId)
            .Include(estate => estate.Images)
            .ToListAsync();
    }

    public async Task<Estate> GetEstateByIdAsync(int id)
    {
        return await Estates
            .Include(estate => estate.Images)
            .FirstAsync(e => e.Id == id);
    }
}
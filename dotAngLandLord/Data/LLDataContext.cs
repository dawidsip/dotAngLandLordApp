using Microsoft.EntityFrameworkCore;
using dotAngLandLord.Interfaces;
using dotAngLandLord.DomainObjects;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using NuGet.Protocol;
using System.Linq;

// using dotAngLandLord.Enums;

namespace dotAngLandLord.Data;

public class LLDataContext : IdentityDbContext, ILLDataContext
{

    // public DbSet<User> Users { get; set; }

    public DbSet<Estate> Estates { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<Facility> Facilities { get; set; }
    public DbSet<EstateFacility> EstateFacilities { get; set; }

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
        modelBuilder.Entity<EstateFacility>().ToTable("Estate_Facility");
        modelBuilder.Entity<Facility>().ToTable("Facility");

        modelBuilder.Entity<Estate>()
            .HasMany(estate => estate.Images)
            .WithOne()
            .HasForeignKey(i => i.EstateId)
            .OnDelete(DeleteBehavior.Cascade);

        // modelBuilder.Entity<Estate>()
        //     .HasMany(estate => estate.EstateFacilities)
        //     .WithOne()
        //     .HasForeignKey(ef => ef.EstateId)
            // .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EstateFacility>()
            .HasKey(e => new { e.EstateId, e.FacilityId });

        modelBuilder.Entity<EstateFacility>()
            .HasOne(ef => ef.Estate)
            .WithMany(e => e.EstateFacilities)
            .HasForeignKey(es => es.EstateId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EstateFacility>()
            .HasOne(ef => ef.Facility)
            .WithMany(f => f.EstateFacilities)
            .HasForeignKey(ff => ff.FacilityId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Facility>()
            .HasKey(f => f.Id);
            // .HasMany(f => f.EstateFacilities)
            // .WithOne(ef => ef.Facility)
            // .OnDelete(DeleteBehavior.Cascade)
            

        // modelBuilder.Entity<Image>()
        //     .HasOne(i => i.Estate)
        //     .WithMany(e => e.Images)
        //     .HasForeignKey(i => i.EstateId);
            
    }

    public async Task<List<Estate>> GetEstatesByUserIdAsync(string userId)
    {
        return await Estates
            .Where(e => e.UserId == userId)
            .Include(estate => estate.Images)
            .Include(ef => ef.EstateFacilities)
                .ThenInclude(f => f.Facility)
            .ToListAsync();
    }

    public async Task<Estate> GetEstateByIdAsync(int id)
    {
        return await Estates
            .Include(estate => estate.Images)
            .Include(ef => ef.EstateFacilities)
                .ThenInclude(f => f.Facility)
            .FirstAsync(e => e.Id == id);
    }

    public async Task<List<Facility>> GetBasicFacilities()
    {
        var basics = await Facilities
            .Where(f => f.IsBasic == true)
            .ToListAsync();

        basics.ForEach(f => f.IsPresent = false);
        // basics.ForEach(f =>System.Console.WriteLine(f.Name+", is basik: "+f.IsBasic));
        return basics;
    }

    public Task<int> SaveChangesAsync() => base.SaveChangesAsync();

    public Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<Estate> Entry(Estate estate) => base.Entry<Estate>(estate);
}
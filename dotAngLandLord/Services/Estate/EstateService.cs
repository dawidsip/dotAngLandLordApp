using dotAngLandLord.DomainObjects;
using dotAngLandLord.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace dotAngLandLord.Services;

public class EstateService : IEstateService
{
    private readonly ILLDataContext _context;
    private readonly ILogger<EstateService> _logger;
    private readonly IFileService _fileService;

    public EstateService(ILLDataContext context, IFileService fileService, ILogger<EstateService> logger)
    {
        _context = context;
        _fileService = fileService;
        _logger = logger;
    }

    public IEnumerable<Estate> GetAll() => _context.Estates.ToList();

    public async Task<Estate> GetById(int id, string userId) => await _context.GetEstateByIdAsync(id);

    public async Task<IEnumerable<Estate>> GetByUserId(string userId) => await _context.GetEstatesByUserIdAsync(userId);

    public async Task<IEnumerable<Facility>> GetFacilities(string facilitiestype) =>
        facilitiestype.ToLower() switch{
                "basic" => await _context.GetBasicFacilities(),
                _ => null, 
                };

    public async Task<Estate?> AddNewEstate(IFormCollection formCollection, string userId)
    {
        var estateBuilder = new EstateBuilder(formCollection);
        estateBuilder.AddPlainTextFields();
        await estateBuilder.AddImages();
        await estateBuilder.AddFacilities(_context);
        var newEstate = await estateBuilder.Build();
        
        newEstate.UserId = userId;

        var entityEntry = await _context.Estates.AddAsync(newEstate);
        if(await _context.SaveChangesAsync() > 0)
        {
            await _fileService.SaveImageFiles(newEstate.Images, "wwwroot/UserImages/");
            return (Estate) entityEntry.Entity;
        }
        return null;
    }

    public async Task<Estate?> UpdateEstate(IFormCollection formCollection, string userId)
    {
        // Build the updated estate object
        var estateBuilder = new EstateBuilder(formCollection);
        estateBuilder.AddPlainTextFields();
        await estateBuilder.AddImages();
        await estateBuilder.AddFacilities(_context);
        var updatedEstate = await estateBuilder.Build();
        
        // Set the user ID
        updatedEstate.UserId = userId;

        // Fetch the existing estate from the database
        var existingEstate = await _context.Estates.FindAsync(updatedEstate.Id);
        if (existingEstate == null)
        {
            // Handle the case where the estate does not exist
            return null;
        }

        // Update the existing estate with the new values
        _context.Entry(existingEstate).CurrentValues.SetValues(updatedEstate);

        // Save the changes to the database
        if (await _context.SaveChangesAsync() > 0)
        {
            System.Console.WriteLine("onto saving files");
            // Save image files if the database update was successful
            await _fileService.SaveImageFiles(updatedEstate.Images, "wwwroot/UserImages/");
            return existingEstate;
        }

        // Return null if the update failed
        return null;
    }

    public async Task<bool> DeleteEstate(int id, string userId)
    {
        var estate = await _context.Estates.FirstOrDefaultAsync(e => e.UserId == userId && e.Id == id);
        if (estate is not null)
        {
            estate.EstateFacilities
                .Where(ef => ef.EstateId == id)
                .ToList()
                .ForEach(ef => { if(!ef.Facility.IsBasic) 
                                    _context.Facilities.Remove(ef.Facility);
                                }
                        );
            await _context.SaveChangesAsync();
            if (estate.Images.Count > 0)
            {
                var filesDeleted = _fileService.DeleteImageFiles(estate.Images, "wwwroot/UserImages/");
                _logger.LogInformation($"Files deleted: {(filesDeleted ? "SUCCESS" : "FAILURE")}");
            }
        }
        var result = estate is not null ? _context.Estates.Remove(estate).State == EntityState.Deleted : false;
        return await _context.SaveChangesAsync() > 0 && result;
    }
}
using dotAngLandLord.DomainObjects;
using dotAngLandLord.Interfaces;

namespace dotAngLandLord.Services;

public class EstateService : IEstateService
{
    private readonly ILLDataContext _context;
    private readonly ILogger<EstateService> _logger;

    public EstateService(ILLDataContext context, ILogger<EstateService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public IEnumerable<Estate> GetAll()
    {
        return _context.Estates.ToList();
    }

    public async Task<Estate> GetById(int id, string userId)
    {
        // System.Console.WriteLine("GetById actuated with userId: ", userId);
        return await _context.GetEstateByIdAsync(id);
    }

    public async Task<IEnumerable<Estate>> GetByUserId(string userId)
    {
        return await _context.GetEstatesByUserIdAsync(userId);
    }

    public async Task<IEnumerable<Facility>> GetFacilities(string facilitiestype)
    {
        // System.Console.WriteLine("GetFacilities actuated with type: ", facilitiestype);
        return facilitiestype.ToLower() switch{
                "basic" => await _context.GetBasicFacilities(),
                _ => null, 
                };
    }

    public async Task<Estate?> AddNewEstate(IFormCollection formCollection, string userId)
    {  
        var estateBuilder = new EstateBuilder(formCollection);
        estateBuilder.AddPlainTextFields();
        await estateBuilder.AddImages();
        await estateBuilder.AddFacilities(_context);
        var newEstate = await estateBuilder.Build();
        3
        newEstate.UserId = userId;

        var entityEntry = await _context.Estates.AddAsync(newEstate);
        if(await _context.SaveChangesAsync() > 0)
        {
            await SaveFiles(newEstate.Images);
            return (Estate) entityEntry.Entity;
        }
        return null;
    }

    private async Task<bool> SaveFiles(IEnumerable<Image> images, string directory = "wwwroot/UserImages/")
    {
        if (!Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        try
        {
            foreach (var image in images)
            {
                var filePath = Path.Combine(directory, image.FileName);
                if (!File.Exists(filePath))
                {
                    await File.WriteAllBytesAsync(filePath, image.Data);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving files");
            return false;
        }
        return true;
    }
}
using System.Security.Claims;
using dotAngLandLord.DomainObjects;
using dotAngLandLord.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                "all" => null, 
                };
    }

    public async Task<Estate?> AddNewEstate(IFormCollection formCollection, string userId)
    {  
        var newEstate = await ComposeEstateFromFormData(formCollection);
        newEstate.UserId = userId;

        var entityEntry = await _context.Estates.AddAsync(newEstate);
        if(await _context.SaveChangesAsync() > 0)
        {
            await SaveFiles(newEstate.Images);
            return (Estate) entityEntry.Entity;
        }
        return null;
    }

    private async Task<Estate> ComposeEstateFromFormData(IFormCollection formCollection)
    {
        var estate = new Estate
        {
            Name = formCollection["name"],
            City = formCollection["city"],
            Region = formCollection["region"],
            Country = formCollection["country"],
            StreetName = formCollection["streetName"],
            StreetNumber = formCollection["streetNumber"],
            FlatNumber = formCollection["flatNumber"],
            CreatedOn = DateTime.Now,
            Images = new List<Image>(),
            EstateFacilities = new List<EstateFacility>(),
        };

        foreach (var formFile in formCollection.Files)
        {
            var index = formFile.Name.Split('[')[1].Split(']')[0];
            using var memoryStream = new MemoryStream();
            await formFile.CopyToAsync(memoryStream);
            var image = new Image()
            {
                FileName = formFile.FileName,
                IsMain = bool.Parse(formCollection[$"images[{index}].isMain"]),
                Data = memoryStream.ToArray(),
                // Estate = estate,
                
            };
            // System.Console.WriteLine("image file name is: " + image.FileName + " index is: " + index + "IsMain is: " + image.IsMain);
            if (int.TryParse(formCollection[$"images[{index}].id"], out int id))
            {
                image.Id = id;
            }

            if (int.TryParse(formCollection[$"images[{index}].estateId"], out int estateId))
            {
                image.EstateId = estateId;
            }
            
            estate.Images.Add(image);
        }


        var facilitiesToAdd = new List<Facility>();
        var estateFacilities = new List<EstateFacility>();
        int idx = 0;
        while (formCollection.ContainsKey($"facilities[{idx}].name"))
        {
            System.Console.WriteLine("facility name is: " + formCollection[$"facilities[{idx}].name"]);
            var facilityName = formCollection[$"facilities[{idx}].name"].ToString();
            bool isBasic = bool.Parse(formCollection[$"facilities[{idx}].isBasic"]);
            bool isPresent = bool.Parse(formCollection[$"facilities[{idx}].isPresent"]);

            Facility facility = await _context.Facilities
                                            .FirstOrDefaultAsync(f => f.Name == facilityName && f.IsBasic == isBasic);

            if (facility == null && facilityName != null)
            {
                facility = new Facility { Name = facilityName, IsBasic = false };
                facilitiesToAdd.Add(facility);
            }

            estateFacilities.Add(new EstateFacility
            {
                IsPresent = isPresent,
                Facility = facility
            });

            idx++;
        }

        if (facilitiesToAdd.Any())
        {
            await _context.Facilities.AddRangeAsync(facilitiesToAdd);
            await _context.SaveChangesAsync();
        }

        estate.EstateFacilities = estateFacilities;
        return estate;
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
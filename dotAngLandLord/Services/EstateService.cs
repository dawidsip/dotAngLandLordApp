using System.Security.Claims;
using dotAngLandLord.DomainObjects;
using dotAngLandLord.Interfaces;
using Microsoft.AspNetCore.Mvc;

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

    public async Task<Estate> GetById(int id)
    {
        return await _context.GetEstateByIdAsync(id);
    }

    public async Task<IEnumerable<Estate>> GetByUserId(string userId)
    {
        return await _context.GetEstatesByUserIdAsync(userId);
    }

    public async Task<Estate> AddNewEstate(IFormCollection formCollection, string userId)
    {

        // foreach(var image in newEstate.Images)
        // {
        //     System.Console.WriteLine();
        //     System.Console.WriteLine(image.FileName);
        //     System.Console.WriteLine();
        // }    
        var newEstate = ComposeEstateFromFormData(formCollection);
        newEstate.UserId = userId;

        var entityEntry = await _context.Estates.AddAsync(newEstate);
        if(_context.SaveChanges() > 0)
        {
            SaveFiles(newEstate.Images);
        }
        return (Estate) entityEntry.Entity;
    }

    private bool SaveFiles(IEnumerable<Image> images, string directory = "wwwroot/UserImages/")
    {
        if (!Directory.Exists(directory))
        {
            System.Console.WriteLine("Directory not found: " + directory);
            // Directory.CreateDirectory(directory);
        }

        try
        {
            foreach (var image in images)
            {
                if(!File.Exists(directory + image.FileName))
                    File.WriteAllBytes(directory + image.FileName, image.Data);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving files");
            System.Console.WriteLine("Error saving files: " + ex.Message);
            return false;
        }
        return true;
    }
    private Estate ComposeEstateFromFormData(IFormCollection formCollection)
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
        };

        foreach (var formFile in formCollection.Files)
        {
            var index = formFile.Name.Split('[')[1].Split(']')[0];
            using var memoryStream = new MemoryStream();
            formFile.CopyToAsync(memoryStream);
            var image = new Image()
            {
                FileName = formFile.FileName,
                IsMain = bool.Parse(formCollection[$"images[{index}].isMain"]),
                Data = memoryStream.ToArray(),
                //Estate = estate,
                
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

        return estate;
    }
}
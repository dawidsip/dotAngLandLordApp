
using dotAngLandLord.DomainObjects;
using dotAngLandLord.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace dotAngLandLord.Services;

internal class EstateBuilder
{
    private readonly IFormCollection _formCollection;
    private Estate estate = new Estate();
    internal EstateBuilder(IFormCollection formCollection)
    {
        Reset();
        _formCollection = formCollection;
    }

    internal void Reset()
    {
        estate = new Estate();
    }

    internal void AddPlainTextFields()
    {
        // System.Console.WriteLine(Environment.NewLine+"id from formdata is : "+ _formCollection["id"].ToString() + Environment.NewLine);
        estate.Id = int.TryParse(_formCollection["id"].ToString(), out var id) ? id : 0;
        // System.Console.WriteLine(Environment.NewLine+"id after parsing  is : "+ estate.Id + Environment.NewLine);
        estate.Name = _formCollection["name"];
        estate.City = _formCollection["city"];
        estate.Region = _formCollection["region"];
        estate.Country = _formCollection["country"];
        estate.StreetName = _formCollection["streetName"];
        estate.StreetNumber = _formCollection["streetNumber"];
        estate.FlatNumber = _formCollection["flatNumber"];
    }

    internal async Task AddImages()
    {
        foreach (var formFile in _formCollection.Files)
        {
            var index = formFile.Name.Split('[')[1].Split(']')[0];
            using var memoryStream = new MemoryStream();
            await formFile.CopyToAsync(memoryStream);
            var image = new Image()
            {
                FileName = formFile.FileName,
                IsMain = bool.Parse(_formCollection[$"images[{index}].isMain"]),
                Data = memoryStream.ToArray(),
                // Estate = estate,
                
            };
            // System.Console.WriteLine("image file name is: " + image.FileName + " index is: " + index + "IsMain is: " + image.IsMain);
            if (int.TryParse(_formCollection[$"images[{index}].id"], out int id))
            {
                image.Id = id;
            }

            if (int.TryParse(_formCollection[$"images[{index}].estateId"], out int estateId))
            {
                image.EstateId = estateId;
            }
            
            estate.Images.Add(image);
        }
    }

    internal async Task AddFacilities(ILLDataContext _context)
    {
        var facilitiesToAdd = new List<Facility>();
        var estateFacilities = new List<EstateFacility>();
        int idx = 0;
        while (_formCollection.ContainsKey($"facilities[{idx}].name"))
        {
            System.Console.WriteLine("facility name is: " + _formCollection[$"facilities[{idx}].name"]);
            var facilityName = _formCollection[$"facilities[{idx}].name"].ToString();
            bool isBasic = bool.Parse(_formCollection[$"facilities[{idx}].isBasic"]);
            bool isPresent = bool.Parse(_formCollection[$"facilities[{idx}].isPresent"]);

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
    }

    internal Task<Estate> Build()
    {
        return Task.FromResult(estate);
    }

}
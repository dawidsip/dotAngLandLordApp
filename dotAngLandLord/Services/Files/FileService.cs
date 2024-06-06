using dotAngLandLord.DomainObjects;
using dotAngLandLord.Interfaces;

namespace dotAngLandLord.Services;

public class FileService : IFileService
{
    private readonly ILogger<FileService> _logger;
    public FileService(ILogger<FileService> logger)
    {
        _logger = logger;
    }

    public async Task<bool> SaveImageFiles(IEnumerable<Image> images, string directory = "wwwroot/UserImages/")
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

    public bool DeleteImageFiles(IEnumerable<Image> images, string directory = "wwwroot/UserImages/")
    {
        if (!Directory.Exists(directory))
        {
            _logger.LogError(directory + " does not exist, therefore no files can be deleted.");
            return false;
        }
        foreach (var image in images)
        {
            var filePath = Path.Combine(directory, image.FileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
        return true;
    }
}
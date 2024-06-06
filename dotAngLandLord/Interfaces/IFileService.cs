using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Interfaces;

public interface IFileService
{
    Task<bool> SaveImageFiles(IEnumerable<Image> images, string directory);
    bool DeleteImageFiles(IEnumerable<Image> images, string directory);
}
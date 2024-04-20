using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Interfaces;

public interface IEstateService
{
    IEnumerable<Estate> GetAll();
    
}
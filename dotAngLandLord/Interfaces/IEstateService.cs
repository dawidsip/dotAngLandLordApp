using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Interfaces;

public interface IEstateService
{
    IEnumerable<Estate> GetAll();

    Task<IEnumerable<Estate>> GetByUserId(string userId);

    Task<Estate> AddNewEstate(Estate estate, string userId);
    Task<Estate> GetById(int id);
    
}
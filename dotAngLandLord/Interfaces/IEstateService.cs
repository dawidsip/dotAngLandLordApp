using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Interfaces;

public interface IEstateService
{
    IEnumerable<Estate> GetAll();

    Task<IEnumerable<Estate>> GetByUserId(int userId);

    Task<Estate> GetById(int id);
    
}
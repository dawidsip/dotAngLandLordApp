using dotAngLandLord.DomainObjects;

namespace dotAngLandLord.Interfaces;

public interface IUserService
{
    IEnumerable<User> GetAll();
}

using dotAngLandLord.DomainObjects;
using dotAngLandLord.Interfaces;

namespace dotAngLandLord.Services;

public class UserService : IUserService
{
    private readonly ILLDataContext _context;
    private readonly ILogger<UserService> _logger;

    public UserService(ILLDataContext context, ILogger<UserService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public IEnumerable<User> GetAll()
    {
        return _context.Users.ToList();
    }
}
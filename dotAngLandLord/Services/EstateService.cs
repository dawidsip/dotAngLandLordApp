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

    public async Task<IEnumerable<Estate>> GetByUserId(int userId)
    {
        return await _context.GetEstatesByUserIdAsync(userId);
    }
}
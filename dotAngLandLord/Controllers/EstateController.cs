using dotAngLandLord.DomainObjects;
using dotAngLandLord.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dotAngLandLord.Controllers;

[ApiController]
[Route("[controller]")]
public class EstateController : ControllerBase
{
    private readonly ILogger<EstateController> _logger;

    private readonly IEstateService _estateService;

    public EstateController(ILogger<EstateController> logger, IEstateService estateService)
    {
        _logger = logger;
        _estateService = estateService;
    }

    [HttpGet]
    public IEnumerable<Estate> GetAll()
    {
        return _estateService.GetAll();
    }

    [HttpGet("id")]
    public async Task<Estate> GetById(int id)
    {
        return await _estateService.GetById(id);
    }

    [HttpGet("userid")]
    public async Task<IEnumerable<Estate>> GetByUserId(int userid)
    {
        return await _estateService.GetByUserId(userid);
    }
}
using System.Security.Claims;
using dotAngLandLord.DomainObjects;
using dotAngLandLord.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

    // [HttpGet]
    // public IEnumerable<Estate> GetAll()
    // {
    //     return _estateService.GetAll();
    // }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUsersEstates()
    {
        System.Console.WriteLine("Entered GetUsersEstates");
        var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        Console.WriteLine("user ID is: " + userId);
        // userId = userId is not null ? "2" : null;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in claims.");
        }

        // Fetch the user's estates from the service
        var userEstates = await _estateService.GetByUserId(userId);

        if (userEstates == null || !userEstates.Any())
        {
            System.Console.WriteLine("not found entered GetUsersEstates");
            return NotFound($"No estates found for user ID: {userId}");
        }

        return Ok(userEstates); // Return the user's estates
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Estate>> AddNewEstate([FromBody] Estate estate)
    {        
        if (estate == null)
        {
            Console.WriteLine();
            return BadRequest("Estate object is null.");
        }

        try
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            System.Console.WriteLine(" user ID is: " + userId);
            var createdEstate = await _estateService.AddNewEstate(estate, userId);
            return CreatedAtAction(nameof(AddNewEstate), new { id = createdEstate.Name }, createdEstate);
        }
        catch (Exception ex)
        {
            // Log the exception (optional)
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("id")]
    public async Task<Estate> GetById(int id)
    {
        return await _estateService.GetById(id);
    }

    [HttpGet("userid")]
    public async Task<IEnumerable<Estate>> GetByUserId(string userid)
    {
        return await _estateService.GetByUserId(userid);
    }
}
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

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUsersEstates()
    {
        // System.Console.WriteLine("Entered GetUsersEstates");
        var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        // Console.WriteLine("user ID is: " + userId);
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
    public async Task<ActionResult<Estate>> AddNewEstate()
    {        
        var form = await Request.ReadFormAsync();
        if (form == null)
        {
            Console.WriteLine("Estate appears to be null.");
            return BadRequest("Estate object is null.");
        }

        try
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("User ID not found.");
                return Unauthorized("User ID not found.");
            }

            _logger.LogInformation($"User ID: {userId}");
        
            var createdEstate = await _estateService.AddNewEstate(form, userId);
            return CreatedAtAction(nameof(AddNewEstate), new { id = createdEstate.Id }, createdEstate);
        }
        catch (Exception ex)
        {
            _logger.LogError("500, Internal server error: " + ex.Message);
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [Authorize]
    [HttpGet("id")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        // Console.WriteLine("user ID is: " + userId);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in claims.");
        }

        var estate = await _estateService.GetById(id, userId);

        if (estate == null)
        {
            return NotFound($"No estate found for user ID: {userId}");
        }
        
        return Ok(estate);
    }

    [Authorize]
    [HttpGet("facilitiestype")]
    public async Task<IActionResult> GetFacilities(string facilitiestype)
    {
        // System.Console.WriteLine("inside GetFacilities with facilitiestype");

        var facilities = await _estateService.GetFacilities(facilitiestype);
        
        return Ok(facilities);
    }

    [Authorize]
    [HttpDelete("delete/id")]
    public async Task<IActionResult> DeleteEstate(int id)
    {
        var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in claims.");
        }
        var result = await _estateService.DeleteEstate(id, userId);
        return result ? Ok(result) : NotFound($"No estate found for user ID: {userId}");
    }
}
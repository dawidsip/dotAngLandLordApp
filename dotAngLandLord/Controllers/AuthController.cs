using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    public AuthController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }

    [HttpGet("IsAuthenticated")]
    public async Task<ActionResult> IsAuthenticated()
    {
        if (User.Identity.IsAuthenticated)
        {
            return Ok(new { isAuthenticated = true });
        }
        return Ok(new { isAuthenticated = false });
    }
}
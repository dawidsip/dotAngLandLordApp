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
        // System.Console.WriteLine("User.Identity != null is: " + User.Identity != null ? "true" : "false");
        // System.Console.WriteLine("User.Identity.Name: " + User.Identity.Name);
        // System.Console.WriteLine("User.Identity.AuthenticationType: " + User.Identity.AuthenticationType);
        // System.Console.WriteLine("\ninside IsAuthenticated controller method with User.Identity.IsAuthenticated set to: "+User.Identity.IsAuthenticated+"\n");
        if (User.Identity.IsAuthenticated)
        {
            // System.Console.WriteLine("\ninside when User.Identity.IsAuthenticated = true \n");
            return Ok(new { isAuthenticated = true });
        }
        return Ok(new { isAuthenticated = false });
    }
}
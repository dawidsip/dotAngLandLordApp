using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions;
using dotAngLandLord.Data;
using dotAngLandLord.Interfaces;
using dotAngLandLord.Services;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("WebApiDatabase");
connectionString = connectionString.Replace("${LL_DB_LOCAL_DOT_USER}", Environment.GetEnvironmentVariable("LL_DB_LOCAL_DOT_USER"));
connectionString = connectionString.Replace("${LL_DB_LOCAL_PASS}", Environment.GetEnvironmentVariable("LL_DB_LOCAL_PASS"));

builder.Services.AddControllers();
builder.Services.AddDbContext<ILLDataContext, LLDataContext>(opt =>
    opt.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)), ServiceLifetime.Singleton);
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Land Lord API", Version = "v1" });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<LLDataContext>();
builder.Services.AddRazorPages();
builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings.
    options.User.AllowedUserNameCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = false;
});
// Define the CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", builder =>
    {
        builder
            .WithOrigins("http://localhost:4200") // Allow requests from the Angular frontend
            .AllowAnyHeader() // Allow any HTTP header
            .AllowAnyMethod() // Allow any HTTP method (GET, POST, PUT, DELETE, etc.)
            .AllowCredentials(); // Allow sending credentials such as cookies
    });
});

builder.Services.ConfigureApplicationCookie(options =>
{
    // Cookie settings
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(5);

    options.LoginPath = "/Identity/Account/Login";
    options.AccessDeniedPath = "/Identity/Account/AccessDenied";
    options.SlidingExpiration = true;
});

builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IEstateService, EstateService>();
var app = builder.Build();

app.UseCors("AllowAngularDev");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// var usrs = app.Services.GetRequiredService<IUserService>().GetAll();
// foreach (var user in usrs)
// {
//     System.Console.WriteLine(String.Format("Id: {0}, FirstName: {1}, LastName: {2}, Email: {3}, Password: {4}, CreatedOn: {5}", user.Id, user.FirstName, user.LastName, user.Email, user.PasswordHash, user.CreatedOn));
// }

// var ests = app.Services.GetRequiredService<IEstateService>().GetAll();
// foreach (var est in ests)
// {
//     System.Console.WriteLine(String.Format("Id: {0}, UserId: {1}, Name: {2}, City: {3}, Region: {4}, StreetName: {5}, StreetNumber: {6}, FlatNumber: {7}, CreatedOn: {8}", est.Id, est.UserId, est.Name, est.City, est.Region, est.StreetName, est.StreetNumber, est.FlatNumber, est.CreatedOn));
// }
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.MapPost("/logout", async (SignInManager<IdentityUser> signInManager,
    [FromBody] object empty) =>
{
    if (empty != null)
    {
        await signInManager.SignOutAsync();
        return Results.Ok();
    }
    return Results.Unauthorized();
})
.RequireAuthorization();

app.UseAuthentication();
app.UseAuthorization();


app.MapRazorPages();
app.MapControllers();

app.Run();

using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using dotAngLandLord.Helpers;
using dotAngLandLord.Interfaces;
using dotAngLandLord.Services;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("WebApiDatabase");
connectionString = connectionString.Replace("${LL_DB_LOCAL_DOT_USER}", Environment.GetEnvironmentVariable("LL_DB_LOCAL_DOT_USER"));
connectionString = connectionString.Replace("${LL_DB_LOCAL_PASS}", Environment.GetEnvironmentVariable("LL_DB_LOCAL_PASS"));

builder.Services.AddControllers();
builder.Services.AddDbContext<ILLDataContext, LLDataContext>(opt =>
    opt.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)), ServiceLifetime.Singleton);
// builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Land Lord API", Version = "v1" });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IEstateService, EstateService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var usrs = app.Services.GetRequiredService<IUserService>().GetAll();
foreach (var user in usrs)
{
    System.Console.WriteLine(String.Format("Id: {0}, FirstName: {1}, LastName: {2}, Email: {3}, Password: {4}, CreatedOn: {5}", user.Id, user.FirstName, user.LastName, user.Email, user.PasswordHash, user.CreatedOn));
}

var ests = app.Services.GetRequiredService<IEstateService>().GetAll();
foreach (var est in ests)
{
    System.Console.WriteLine(String.Format("Id: {0}, UserId: {1}, Name: {2}, City: {3}, Region: {4}, StreetName: {5}, StreetNumber: {6}, FlatNumber: {7}, CreatedOn: {8}", est.Id, est.UserId, est.Name, est.City, est.Region, est.StreetName, est.StreetNumber, est.FlatNumber, est.CreatedOn));
}
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthorization();

app.MapControllers();

app.Run();

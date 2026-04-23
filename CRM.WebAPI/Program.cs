using CRM.DAL;
using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDapper;
using CRM.DAL.RepositoriesDupper;
using CRM.Entities.Security;
using CRM.Services;
using CRM.Services.FamilleProduits;
using CRM.Services.LigneProspections;
using CRM.Services.produitecerms;
using CRM.Services.prospections;
using CRM.Services.Societe;
using CRM.Services.StatutPrespection;
using CRM.Services.SupportProduits;
using CRM.WebAPI.Middlewares;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Injection du DbContext

builder.Services.AddDbContext<SecurityDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("CRM"));
});
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("CRM"));
});

// Identity 

builder.Services
    .AddIdentity<SecUser, SecRole>()
    .AddEntityFrameworkStores<SecurityDbContext>()
    .AddDefaultTokenProviders();

// injection Repositories

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped(typeof(IProspectRepositoryDapper), typeof(ProspectRepositoryDapper));
builder.Services.AddScoped<IDomaineRespositoryDapper, DomaineRespositoryDapper>();
builder.Services.AddScoped<IStatutProspectionRepositoryDapper, StatutProspectionRepositoryDapper>();
builder.Services.AddScoped<IProspectionRespositoryDapper, ProspectionRespositoryDapper>();
builder.Services.AddScoped<ILigneProspectionRespositoryDapper, LigneProspectionRespositoryDapper>();
builder.Services.AddScoped<IProduitCermRespositoryDapper, ProduitCermRespositoryDapper>();

// injection Services
builder.Services.AddScoped<IAdminSeeder,AdminSeeder>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IProspectService, ProspectService>();
builder.Services.AddScoped<IDomaineActiviteService, DomaineActiviteService>();
builder.Services.AddScoped<IstatutProspectionService, StatutProspectionService>();
builder.Services.AddScoped<IProspectionServices, ProspectionService>();
builder.Services.AddScoped<IFamilleProduitService, FamilleProduitService>();
builder.Services.AddScoped<ISupportProduitService, SupportProduitService>();
builder.Services.AddScoped<ISocieteeService, SocieteeService>();
builder.Services.AddScoped<ILigneProspectionService, LigneProspectionService>();
builder.Services.AddScoped<IproduitCermService, ProduitCermService>();
//builder.Services.AddHostedService<AdminSeederHostedService>();




// JWT
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Swagger  

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "CRM API",
        Version = "V1",
        Description = "API du projet CRM"
    });

    


});




var app = builder.Build();



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CRM API v1");
        c.RoutePrefix = String.Empty; // Swagger a la racine
    });
}



// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


app.Run();

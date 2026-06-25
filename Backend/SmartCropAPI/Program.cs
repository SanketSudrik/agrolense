using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SmartCropAPI.Configurations;
using SmartCropAPI.Data;
using SmartCropAPI.Helpers;
using SmartCropAPI.Middleware;
using SmartCropAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Enforce port 5063
builder.WebHost.UseUrls("http://localhost:5063");

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:4200") // Angular local dev
              .AllowCredentials();
    });
});

// Configure PostgreSQL Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Dependency Injection using extension method
builder.Services.AddApplicationServices();

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key is missing.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

// Configure Swagger/OpenAPI with JWT Auth Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Smart Crop API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Apply pending migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Applies any pending migrations for the context to the database.
    // Will create the database if it does not already exist.
    dbContext.Database.Migrate();

    // Seed a default Admin user if one doesn't exist
    if (!dbContext.Users.Any(u => u.Role == "Admin"))
    {
        var adminUser = new User
        {
            FullName = "Admin",
            Email = "admin@smartcrop.com",
            PasswordHash = PasswordHasher.HashPassword("Admin@123"),
            Role = "Admin"
        };
        dbContext.Users.Add(adminUser);
        dbContext.SaveChanges();
    }

    // Seed Fertilizer Recommendations and Disease details
    DataSeeder.SeedFertilizerRecommendations(dbContext);
}

// Ensure AIModels directory exists for ONNX models
var aiModelsPath = Path.Combine(app.Environment.ContentRootPath, "AIModels");
if (!Directory.Exists(aiModelsPath))
{
    Directory.CreateDirectory(aiModelsPath);
}

// Ensure wwwroot directory exists to prevent StaticFiles warning
var wwwrootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
if (!Directory.Exists(wwwrootPath))
{
    Directory.CreateDirectory(wwwrootPath);
}

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

// Always enable Swagger for this project so the UI is accessible regardless of how it's launched
app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection(); // Commented out to prevent the local HTTPS warning

// Serve static files from wwwroot (specifically for uploaded images)
app.UseStaticFiles();

app.UseCors("DefaultPolicy");

// Order is important! Auth must be before MapControllers
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();

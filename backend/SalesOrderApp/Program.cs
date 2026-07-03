using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Application.Mapping;
using SalesOrderApp.Application.Services;
using SalesOrderApp.Infrastructure.Data;
using SalesOrderApp.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Database (EF Core + SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories (Data Access Layer)
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IItemRepository, ItemRepository>();
builder.Services.AddScoped<ISalesOrderRepository, SalesOrderRepository>();

// Services (Business Logic Layer)
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<ISalesOrderService, SalesOrderService>();

// AutoMapper (entity <-> DTO mapping)
builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS - allow the React dev server to call this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Apply migrations (or create the database from the model if no migrations
// have been scaffolded yet) and seed master data.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.GetMigrations().Any())
    {
        db.Database.Migrate();
    }
    else
    {
        db.Database.EnsureCreated();
    }
    DbSeeder.Seed(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();

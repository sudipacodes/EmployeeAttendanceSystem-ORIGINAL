using System.Text;
using EmployeeAttendanceSystem.Data;
using EmployeeAttendanceSystem.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var connStr = builder.Configuration.GetConnectionString("DefaultConnection") ?? "";
if (connStr.Contains("Host=", StringComparison.OrdinalIgnoreCase))
{
    AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connStr));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlite(string.IsNullOrWhiteSpace(connStr) ? "Data Source=attendance.db" : connStr));
}
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AttendanceService>();
var key = builder.Configuration["Jwt:Key"] ?? "EmployeeAttendanceSystem_Secret_Key_Change_In_Production_2026";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o => {
    o.TokenValidationParameters = new TokenValidationParameters { ValidateIssuerSigningKey=true, IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), ValidateIssuer=false, ValidateAudience=false, ClockSkew=TimeSpan.Zero };
});
builder.Services.AddAuthorization();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();
using (var scope = app.Services.CreateScope()) { var db = scope.ServiceProvider.GetRequiredService<AppDbContext>(); db.Database.EnsureCreated(); DbSeeder.Seed(db); }
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
app.UseCors();
app.UseDefaultFiles(); app.UseStaticFiles();
app.UseAuthentication(); app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();

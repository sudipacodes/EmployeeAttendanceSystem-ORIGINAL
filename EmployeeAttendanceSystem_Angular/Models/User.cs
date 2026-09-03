namespace EmployeeAttendanceSystem.Models;
public class User { public int Id{get;set;} public string Name{get;set;}=""; public string Email{get;set;}=""; public string PasswordHash{get;set;}=""; public string Role{get;set;}="Employee"; public bool IsActive{get;set;}=true; public DateTime CreatedAt{get;set;}=DateTime.UtcNow; }

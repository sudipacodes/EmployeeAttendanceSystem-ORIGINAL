namespace EmployeeAttendanceSystem.Models;
public class Attendance { public int Id{get;set;} public int UserId{get;set;} public DateTime Date{get;set;} public DateTime? CheckIn{get;set;} public DateTime? CheckOut{get;set;} public double? WorkingHours{get;set;} public string Status{get;set;}="Present"; public User? User{get;set;} }

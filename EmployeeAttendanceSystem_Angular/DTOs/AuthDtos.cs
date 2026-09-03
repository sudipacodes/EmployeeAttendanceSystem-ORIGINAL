using System.ComponentModel.DataAnnotations;

namespace EmployeeAttendanceSystem.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
    [RegularExpression(@"^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$",
        ErrorMessage = "Name can contain only letters, spaces, dots, apostrophes and hyphens.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
    [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    [MaxLength(50, ErrorMessage = "Password cannot exceed 50 characters.")]
    [RegularExpression(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$",
        ErrorMessage = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
    )]
    public string Password { get; set; } = string.Empty;
}

public class LoginDto
{
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
    [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}

public class LeaveDto
{
    [Required(ErrorMessage = "Start date is required.")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "End date is required.")]
    public DateTime EndDate { get; set; }

    [Required(ErrorMessage = "Reason is required.")]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "Reason must be between 3 and 500 characters.")]
    public string Reason { get; set; } = string.Empty;
}

public class LeaveDecisionDto
{
    [Required(ErrorMessage = "Status is required.")]
    public string Status { get; set; } = string.Empty;
}

using EmployeeAttendanceSystem.Data;
using EmployeeAttendanceSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAttendanceSystem.Services;

public class AttendanceService
{
    readonly AppDbContext db;

    public AttendanceService(AppDbContext db)
    {
        this.db = db;
    }

    public object CheckIn(int uid)
    {
        var now = DateTime.Now;
        var today = now.Date;
        var a = db.Attendances.FirstOrDefault(x => x.UserId == uid && x.Date == today);

        if (a != null && a.CheckIn.HasValue)
            return new { success = false, message = "Already checked in today" };

        if (a == null)
        {
            a = new Attendance { UserId = uid, Date = today, Status = "Present" };
            db.Attendances.Add(a);
        }

        a.CheckIn = now;
        // Check-in after 09:30 AM is recorded as Late
        a.Status = a.CheckIn.Value.TimeOfDay > new TimeSpan(9, 30, 0) ? "Late" : "Present";
        db.SaveChanges();

        return new { success = true, message = "Check-in recorded", attendance = a };
    }

    public object CheckOut(int uid)
    {
        var now = DateTime.Now;
        var today = now.Date;
        var a = db.Attendances.FirstOrDefault(x => x.UserId == uid && x.Date == today);

        if (a == null || !a.CheckIn.HasValue)
            return new { success = false, message = "Please check in first" };

        if (a.CheckOut.HasValue)
            return new { success = false, message = "Already checked out today" };

        a.CheckOut = now;
        a.WorkingHours = Math.Round((a.CheckOut.Value - a.CheckIn.Value).TotalHours, 2);
        a.Status = a.WorkingHours < 4 ? "Half Day" : a.Status;
        db.SaveChanges();

        return new { success = true, message = "Check-out recorded", attendance = a };
    }
}

using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class Attendance
{
    public int AttendanceId { get; set; }

    public int TripId { get; set; }

    public int StudentId { get; set; }

    public int? StopId { get; set; }

    public string AttendanceType { get; set; } = null!; // Pickup, Dropoff

    public string Status { get; set; } = null!; // Present, Absent, Late

    public DateTime Timestamp { get; set; }

    public string? MarkedBy { get; set; }

    public string? Notes { get; set; }

    public virtual Trip Trip { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;

    public virtual RouteStop? Stop { get; set; }
}
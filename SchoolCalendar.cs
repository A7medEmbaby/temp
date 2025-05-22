using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class SchoolCalendar
{
    public int CalendarId { get; set; }

    public int SchoolId { get; set; }

    public DateTime Date { get; set; }

    public string DayType { get; set; } = null!; // SchoolDay, Weekend, Holiday, SpecialEvent

    public string? Description { get; set; }

    public bool AffectsMorningTrips { get; set; } = true;

    public bool AffectsAfternoonTrips { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual School School { get; set; } = null!;
}
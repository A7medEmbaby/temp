using System;
using System.Collections.Generic;

namespace RihlaAPI.Models.Entities;

public partial class TripTemplate
{
    public int TemplateId { get; set; }

    public int RouteId { get; set; }

    public int BusId { get; set; }

    public int DriverId { get; set; }

    public int SupervisorId { get; set; }

    public string Name { get; set; } = null!;

    public string ScheduleType { get; set; } = null!; // Daily, SpecificDays

    public string? DaysOfWeek { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan? EndTime { get; set; }

    public bool ActiveStatus { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Route Route { get; set; } = null!;

    public virtual Bus Bus { get; set; } = null!;

    public virtual Driver Driver { get; set; } = null!;

    public virtual BusSupervisor Supervisor { get; set; } = null!;

    public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();
}